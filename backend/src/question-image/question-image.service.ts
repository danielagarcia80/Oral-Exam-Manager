import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestionImageDto } from './create-question-image.dto';
import { QuestionImageResponseDto } from './question-image-response.dto';
import { Express } from 'express';
import { QuestionImages } from '@prisma/client';

@Injectable()
export class QuestionImageService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateQuestionImageDto): Promise<QuestionImageResponseDto> {
    const saved = await this.prisma.questionImages.create({ data: dto });
    return toImageResponseDto(saved);
  }

  async findAll(): Promise<QuestionImageResponseDto[]> {
    const all: QuestionImages[] = await this.prisma.questionImages.findMany();
    return all.map(toImageResponseDto);
  }

  async saveImage(
    file: Express.Multer.File,
    courseId: string,
  ): Promise<QuestionImageResponseDto> {
    if (!file || !file.path || !file.filename) {
      throw new BadRequestException('No file received');
    }

    const relativePath = `/uploads/${file.filename.replace(/\\/g, '/')}`;

    const saved = await this.prisma.questionImages.create({
      data: {
        image_data: relativePath,
        original_filename: file.originalname,
        course_id: courseId,
      },
    });

    console.log('Saving image with course_id:', courseId);

    return toImageResponseDto(saved);
  }

  async findByCourse(courseId: string): Promise<QuestionImageResponseDto[]> {
    console.log('Finding images for course:', courseId);

    const images = await this.prisma.questionImages.findMany();
    console.log(
      'All images in DB:',
      images.map((i) => ({ id: i.image_id, course_id: i.course_id })),
    );

    const filtered = images.filter((img) => img.course_id === courseId);
    console.log(
      'Filtered manually:',
      filtered.map((i) => i.image_id),
    );

    const prismaFiltered = await this.prisma.questionImages.findMany({
      where: { course_id: courseId },
    });
    console.log(
      'Prisma filtered:',
      prismaFiltered.map((i) => i.image_id),
    );

    return prismaFiltered.map(toImageResponseDto);
  }
}

// ✅ Mapping function for consistency and safety
function toImageResponseDto(img: QuestionImages): QuestionImageResponseDto {
  return {
    image_id: img.image_id,
    filename: img.original_filename,
    path: img.image_data,
    message: 'OK',
  };
}
