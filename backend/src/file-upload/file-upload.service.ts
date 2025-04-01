import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFileUploadDto } from './create-file-upload.dto';
import { FileUploadResponseDto } from './file-upload-response.dto';

@Injectable()
export class FileUploadService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateFileUploadDto): Promise<FileUploadResponseDto> {
    const question = await this.prisma.question.findUnique({
      where: { question_id: dto.question_id },
    });

    if (!question) {
      throw new BadRequestException('Invalid question_id');
    }

    return this.prisma.fileUpload.create({
      data: {
        ...dto,
        uploaded_at: new Date(),
      },
    });
  }

  async findAll(): Promise<FileUploadResponseDto[]> {
    return this.prisma.fileUpload.findMany();
  }
}
