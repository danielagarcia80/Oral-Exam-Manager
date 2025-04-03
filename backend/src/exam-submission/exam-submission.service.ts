import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExamSubmissionDto } from './create-exam-submission.dto';
import { ExamSubmissionResponseDto } from './exam-submission-response.dto';

@Injectable()
export class ExamSubmissionService {
  constructor(private prisma: PrismaService) {}

  async create(
    dto: CreateExamSubmissionDto,
  ): Promise<ExamSubmissionResponseDto> {
    const student = await this.prisma.user.findUnique({
      where: { user_id: dto.student_id },
    });
    const exam = await this.prisma.exam.findUnique({
      where: { exam_id: dto.exam_id },
    });

    if (!student || !exam) {
      throw new BadRequestException('Invalid student_id or exam_id');
    }

    return this.prisma.examSubmission.create({
      data: {
        ...dto,
        submitted_at: new Date(),
      },
    });
  }

  async findAll(): Promise<ExamSubmissionResponseDto[]> {
    return this.prisma.examSubmission.findMany();
  }
}
