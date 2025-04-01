import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestionImageDto } from './create-question-image.dto';
import { QuestionImageResponseDto } from './question-image-response.dto';

@Injectable()
export class QuestionImageService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateQuestionImageDto): Promise<QuestionImageResponseDto> {
    return this.prisma.questionImages.create({ data: dto });
  }

  async findAll(): Promise<QuestionImageResponseDto[]> {
    return this.prisma.questionImages.findMany();
  }
}
