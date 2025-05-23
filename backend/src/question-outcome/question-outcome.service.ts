import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestionOutcomeDto } from './create-question-outcome.dto';
import { QuestionOutcomeResponseDto } from './question-outcome-response.dto';

@Injectable()
export class QuestionOutcomeService {
  constructor(private prisma: PrismaService) {}

  async create(
    dto: CreateQuestionOutcomeDto,
  ): Promise<QuestionOutcomeResponseDto> {
    const question = await this.prisma.question.findUnique({
      where: { question_id: dto.question_id },
    });
    const outcome = await this.prisma.learningOutcome.findUnique({
      where: { learning_outcome_id: dto.learning_outcome_id },
    });

    if (!question || !outcome) {
      throw new BadRequestException(
        'Invalid question_id or learning_outcome_id',
      );
    }

    return this.prisma.questionAddressesOutcome.create({ data: dto });
  }

  async findAll(): Promise<QuestionOutcomeResponseDto[]> {
    return this.prisma.questionAddressesOutcome.findMany();
  }
}
