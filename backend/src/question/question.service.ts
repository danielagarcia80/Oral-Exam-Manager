import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestionDto } from './create-question.dto';
import { QuestionResponseDto } from './question-response.dto';
import { Type } from '@prisma/client';

@Injectable()
export class QuestionService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateQuestionDto) {
    return this.prisma.question.create({
      data: {
        ...data,
        type: data.type as Type, // 👈 cast it here
      },
    });
  }

  async findAll(): Promise<QuestionResponseDto[]> {
    return this.prisma.question.findMany();
  }
}
