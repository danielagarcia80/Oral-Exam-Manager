import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestionKeywordDto } from './create-question-keyword.dto';
import { QuestionKeywordResponseDto } from './question-keyword-response.dto';

@Injectable()
export class QuestionKeywordService {
  constructor(private prisma: PrismaService) {}

  async create(
    dto: CreateQuestionKeywordDto,
  ): Promise<QuestionKeywordResponseDto> {
    // Check if both question and keyword exist
    const question = await this.prisma.question.findUnique({
      where: { question_id: dto.question_id },
    });
    const keyword = await this.prisma.keyword.findUnique({
      where: { keyword_id: dto.keyword_id },
    });

    if (!question || !keyword) {
      throw new BadRequestException('Invalid question_id or keyword_id');
    }

    return this.prisma.questionHasKeyword.create({ data: dto });
  }

  async findAll(): Promise<QuestionKeywordResponseDto[]> {
    return this.prisma.questionHasKeyword.findMany();
  }
}
