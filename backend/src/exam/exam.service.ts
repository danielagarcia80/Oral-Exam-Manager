import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExamDto } from './create-exam.dto';
import { ExamResponseDto } from './exam-response.dto';
import { UpdateExamDto } from './update-exam.dto';

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

    console.log('[CreateExam] Incoming data:', data);

    return this.prisma.exam.create({
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        start_date: new Date(data.start_date),
        end_date: new Date(data.end_date),
        course_id: data.course_id,

        // ✅ new fields
        duration_minutes: data.duration_minutes,
        timing_mode: data.timing_mode,
        requires_audio: data.requires_audio,
        requires_video: data.requires_video,
        requires_screen_share: data.requires_screen_share,
      },
    });
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
    const assignments = await this.prisma.assignedExam.findMany({
      where: {
        student_id: userId,
        exam: {
          end_date: {
            gt: new Date(), // Only upcoming exams
          },
        },
      },
      include: {
        exam: {
          include: {
            course: {
              select: { title: true },
            },
          },
        },
      },
      orderBy: {
        exam: {
          end_date: 'asc',
        },
      },
    });

    // Extract just the exams
    return assignments.map((a) => a.exam);
  }

  async getPastExamsForUser(userId: string) {
    const now = new Date();

    const assignments = await this.prisma.assignedExam.findMany({
      where: {
        student_id: userId,
        exam: {
          end_date: {
            lte: now,
          },
        },
      },
      include: {
        exam: {
          include: {
            course: {
              select: { title: true },
            },
          },
        },
      },
      orderBy: {
        exam: {
          end_date: 'desc',
        },
      },
    });

    return assignments.map((a) => a.exam);
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

    console.log('[UpdateExam] Payload:', examData);

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
