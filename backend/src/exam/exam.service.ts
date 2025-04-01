import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExamDto } from './create-exam.dto';
import { ExamResponseDto } from './exam-response.dto';

@Injectable()
export class ExamService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateExamDto): Promise<ExamResponseDto> {
    // Ensure course exists
    const course = await this.prisma.course.findUnique({
      where: { course_id: data.course_id },
    });

    if (!course) {
      throw new BadRequestException('Course not found');
    }

    return this.prisma.exam.create({ data });
  }

  async findAll(): Promise<ExamResponseDto[]> {
    return this.prisma.exam.findMany();
  }
}
