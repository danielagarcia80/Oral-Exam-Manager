import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestionImageDto } from './create-question-image.dto';
import { QuestionImageResponseDto } from './question-image-response.dto';
import { Express } from 'express';

@Injectable()
export class QuestionImageService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateQuestionImageDto): Promise<QuestionImageResponseDto> {
    return this.prisma.questionImages.create({ data: dto });
  }

  async findAll(): Promise<QuestionImageResponseDto[]> {
    return this.prisma.questionImages.findMany();
  }

  async saveImage(file: Express.Multer.File) {
    if (!file || !file.path) {
      throw new BadRequestException('No file received');
    }

    const saved = await this.prisma.questionImages.create({
      data: {
        image_data: `/uploads/${file.filename}`, // Save path or full URL if serving
      },
    });

    return {
      image_id: saved.image_id,
      message: 'Image uploaded successfully',
    };
  }
}
