import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseLearningOutcomeDto } from './create-course-learning-outcome.dto';
import { CourseLearningOutcomeResponseDto } from './course-learning-outcome-response.dto';

@Injectable()
export class CourseLearningOutcomeService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCourseLearningOutcomeDto): Promise<CourseLearningOutcomeResponseDto> {
    // Check course and outcome existence
    const course = await this.prisma.course.findUnique({ where: { course_id: dto.course_id } });
    const outcome = await this.prisma.learningOutcome.findUnique({ where: { learning_outcome_id: dto.learning_outcome_id } });

    if (!course || !outcome) {
      throw new BadRequestException('Invalid course_id or learning_outcome_id');
    }

    return this.prisma.courseLearningOutcome.create({ data: dto });
  }

  async findAll(): Promise<CourseLearningOutcomeResponseDto[]> {
    return this.prisma.courseLearningOutcome.findMany();
  }
}
