import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestionDto } from './create-question.dto';
import { QuestionResponseDto } from './question-response.dto';

@Injectable()
export class QuestionService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateQuestionDto): Promise<QuestionResponseDto> {
    return this.prisma.question.create({ data });
  }

  async findAll(): Promise<QuestionResponseDto[]> {
    return this.prisma.question.findMany();
  }
}
