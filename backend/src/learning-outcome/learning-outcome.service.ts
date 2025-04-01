import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLearningOutcomeDto } from './create-learning-outcome.dto';
import { LearningOutcomeResponseDto } from './learning-outcome-response.dto';

@Injectable()
export class LearningOutcomeService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateLearningOutcomeDto): Promise<LearningOutcomeResponseDto> {
    return this.prisma.learningOutcome.create({ data });
  }

  async findAll(): Promise<LearningOutcomeResponseDto[]> {
    return this.prisma.learningOutcome.findMany();
  }
}
