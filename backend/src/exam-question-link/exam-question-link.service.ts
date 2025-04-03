import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExamQuestionLinkDto } from './create-exam-question-link.dto';
import { ExamQuestionLinkResponseDto } from './exam-question-link-response.dto';

@Injectable()
export class ExamQuestionLinkService {
  constructor(private prisma: PrismaService) {}

  async create(
    dto: CreateExamQuestionLinkDto,
  ): Promise<ExamQuestionLinkResponseDto> {
    const exam = await this.prisma.exam.findUnique({
      where: { exam_id: dto.exam_id },
    });
    const question = await this.prisma.question.findUnique({
      where: { question_id: dto.question_id },
    });

    if (!exam || !question) {
      throw new BadRequestException('Invalid exam_id or question_id');
    }

    return this.prisma.examIncludesQuestion.create({ data: dto });
  }

  async findAll(): Promise<ExamQuestionLinkResponseDto[]> {
    return this.prisma.examIncludesQuestion.findMany();
  }
}
