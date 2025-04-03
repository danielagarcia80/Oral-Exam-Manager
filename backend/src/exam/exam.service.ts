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

  async getUpcomingExamsForUser(userId: string): Promise<ExamResponseDto[]> {
    // Get all student course IDs
    const enrolledCourses = await this.prisma.enrollment.findMany({
      where: { student_id: userId },
      select: { course_id: true },
    });

    const taughtCourses = await this.prisma.teaches.findMany({
      where: { instructor_id: userId },
      select: { course_id: true },
    });

    const allCourseIds = [
      ...new Set([
        ...enrolledCourses.map((e) => e.course_id),
        ...taughtCourses.map((t) => t.course_id),
      ]),
    ];

    if (allCourseIds.length === 0) return [];

    const upcomingExams = await this.prisma.exam.findMany({
      where: {
        course_id: { in: allCourseIds },
        end_date: { gt: new Date() },
      },
      orderBy: { end_date: 'asc' }, // optional
    });

    return upcomingExams.map((exam) => ({
      exam_id: exam.exam_id,
      title: exam.title,
      course_id: exam.course_id,
      start_date: exam.start_date,
      end_date: exam.end_date,
      description: exam.description,
      type: exam.type,
    }));
  }

  async getExamsForInstructor(userId: string): Promise<ExamResponseDto[]> {
    const teaches = await this.prisma.teaches.findMany({
      where: { instructor_id: userId },
      select: { course_id: true },
    });

    const courseIds = teaches.map((t) => t.course_id);

    if (courseIds.length === 0) return [];

    const exams = await this.prisma.exam.findMany({
      where: {
        course_id: { in: courseIds },
      },
      orderBy: { start_date: 'asc' },
    });

    return exams.map((exam) => ({
      exam_id: exam.exam_id,
      title: exam.title,
      description: exam.description,
      type: exam.type,
      start_date: exam.start_date,
      end_date: exam.end_date,
      course_id: exam.course_id,
    }));
  }
}
