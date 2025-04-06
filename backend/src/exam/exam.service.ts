import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExamDto } from './create-exam.dto';
import { ExamResponseDto } from './exam-response.dto';
import { UpdateExamDto } from './update-exam.dto';

// ...imports stay the same

@Injectable()
export class ExamService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateExamDto): Promise<ExamResponseDto> {
    const course = await this.prisma.course.findUnique({
      where: { course_id: data.course_id },
    });

    if (!course) {
      throw new BadRequestException('Course not found');
    }

    return this.prisma.exam.create({ data });
  }

  async findById(examId: string) {
    return this.prisma.exam.findUnique({
      where: { exam_id: examId },
      include: {
        questions: {
          include: {
            question: true,
          },
          orderBy: { order_index: 'asc' },
        },
      },
    });
  }

  async findAll(): Promise<ExamResponseDto[]> {
    return this.prisma.exam.findMany();
  }

  async getUpcomingExamsForUser(userId: string) {
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
      orderBy: { end_date: 'asc' },
      include: {
        course: {
          select: { title: true },
        },
      },
    });

    return upcomingExams;
  }

  async getPastExamsForUser(userId: string) {
    const now = new Date();

    const enrollments = await this.prisma.enrollment.findMany({
      where: { student_id: userId },
      include: {
        course: {
          include: {
            exams: {
              where: { end_date: { lte: now } },
              include: {
                course: {
                  select: { title: true },
                },
              },
            },
          },
        },
      },
    });

    return enrollments.flatMap((enrollment) => enrollment.course.exams);
  }

  async getExamsForInstructor(userId: string) {
    const teaches = await this.prisma.teaches.findMany({
      where: { instructor_id: userId },
      select: { course_id: true },
    });

    const courseIds = teaches.map((t) => t.course_id);

    if (courseIds.length === 0) return [];

    return this.prisma.exam.findMany({
      where: {
        course_id: { in: courseIds },
      },
      orderBy: { start_date: 'asc' },
      include: {
        course: {
          select: { title: true },
        },
      },
    });
  }

  async getAllExamsForStudent(userId: string) {
    const enrollments = await this.prisma.enrollment.findMany({
      where: { student_id: userId },
      include: {
        course: {
          include: {
            exams: {
              include: {
                course: {
                  select: { title: true },
                },
              },
            },
          },
        },
      },
    });

    return enrollments.flatMap((enrollment) => enrollment.course.exams);
  }

  async getExamsForCourse(courseId: string): Promise<ExamResponseDto[]> {
    const exams = await this.prisma.exam.findMany({
      where: { course_id: courseId },
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

  async update(examId: string, data: UpdateExamDto) {
    const { questionIds, ...examData } = data;

    return this.prisma.exam.update({
      where: { exam_id: examId },
      data: {
        ...examData,
        questions: questionIds
          ? {
              deleteMany: {},
              create: questionIds.map((qid, index) => ({
                question_id: qid,
                order_index: index,
              })),
            }
          : undefined,
      },
      include: {
        questions: true,
      },
    });
  }
}
