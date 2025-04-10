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
    const { exam_id, question_id, order_index, time_allocation } = dto;

    const exam = await this.prisma.exam.findUnique({
      where: { exam_id },
    });
    const question = await this.prisma.question.findUnique({
      where: { question_id },
    });

    if (!exam || !question) {
      throw new BadRequestException('Invalid exam_id or question_id');
    }

    return this.prisma.examIncludesQuestion.create({
      data: {
        exam_id,
        question_id,
        order_index,
        time_allocation: time_allocation ?? null, // explicitly handle optional field
      },
    });
  }

  async findAll(): Promise<ExamQuestionLinkResponseDto[]> {
    return this.prisma.examIncludesQuestion.findMany();
  }

  async removeAllFromExam(exam_id: string) {
    return this.prisma.examIncludesQuestion.deleteMany({
      where: { exam_id },
    });
  }
}
