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

        duration_minutes: data.duration_minutes,
        timing_mode: data.timing_mode,
        requires_audio: data.requires_audio,
        requires_video: data.requires_video,
        requires_screen_share: data.requires_screen_share,

        allowed_attempts: data.allowed_attempts ?? 1,
      },
    });
  }

  async findById(examId: string) {
    return this.prisma.exam.findUnique({
      where: { exam_id: examId },
      include: {
        questions: {
          orderBy: { order_index: 'asc' },
          include: {
            question: {
              include: {
                images: {
                  include: {
                    image: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async findAll(): Promise<ExamResponseDto[]> {
    return this.prisma.exam.findMany();
  }

  async getUpcomingExamsForUser(userId: string) {
    // 1. Fetch all assigned exams (upcoming only)
    const assignments = await this.prisma.assignedExam.findMany({
      where: {
        student_id: userId,
        exam: {
          end_date: { gt: new Date() }, // Only upcoming exams
        },
      },
      include: {
        exam: {
          include: {
            course: { select: { title: true } },
          },
        },
      },
      orderBy: { exam: { end_date: 'asc' } },
    });

    // 2. Process each exam to calculate remaining attempts
    const filteredExams = [];

    for (const assignment of assignments) {
      const exam = assignment.exam;

      // Count how many times student has submitted this exam
      const attemptsUsed = await this.prisma.examSubmission.count({
        where: {
          student_id: userId,
          exam_id: exam.exam_id,
        },
      });

      const remainingAttempts = Math.max(
        0,
        exam.allowed_attempts - attemptsUsed,
      );

      // Only include exam if student has attempts remaining
      if (remainingAttempts > 0) {
        // Add attempts info for UI (optional but useful)
        exam['attempts_used'] = attemptsUsed;
        exam['remaining_attempts'] = remainingAttempts;

        filteredExams.push(exam);
      }
    }

    return filteredExams;
  }

  async getPastExamsForUser(userId: string) {
    const now = new Date();

    const assignments = await this.prisma.assignedExam.findMany({
      where: {
        student_id: userId,
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

    const pastExams = [];

    for (const assignment of assignments) {
      const exam = assignment.exam;

      // Count how many submissions student has for this exam
      const attemptsUsed = await this.prisma.examSubmission.count({
        where: {
          student_id: userId,
          exam_id: exam.exam_id,
        },
      });

      const hasNoAttemptsLeft = attemptsUsed >= exam.allowed_attempts;
      const dueDatePassed = exam.end_date <= now;

      // ✅ If either condition met, add to past exams
      if (dueDatePassed || hasNoAttemptsLeft) {
        // Get all submissions for this student + exam
        const allSubmissions = await this.prisma.examSubmission.findMany({
          where: {
            student_id: userId,
            exam_id: exam.exam_id,
          },
          select: {
            grade_percentage: true,
            feedback: true,
            submitted_at: true,
          },
        });

        // Safely filter + sort by highest grade
        const gradedSubmissions = allSubmissions.filter(
          (s) =>
            s.grade_percentage !== null && s.grade_percentage !== undefined,
        );

        const highestSubmission =
          gradedSubmissions.sort(
            (a, b) => (b.grade_percentage ?? 0) - (a.grade_percentage ?? 0),
          )[0] ?? null;

        // Attach info for frontend
        exam['attempts_used'] = attemptsUsed;
        exam['remaining_attempts'] = Math.max(
          0,
          exam.allowed_attempts - attemptsUsed,
        );
        exam['submission'] = highestSubmission;

        pastExams.push(exam);
      }
    }

    return pastExams;
  }

  async getExamsForInstructor(userId: string) {
    const memberships = await this.prisma.courseMembership.findMany({
      where: {
        userId,
        role: 'INSTRUCTOR',
      },
      select: {
        courseId: true,
      },
    });

    const courseIds = memberships.map((m) => m.courseId);

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
    const memberships = await this.prisma.courseMembership.findMany({
      where: {
        userId,
        role: 'STUDENT',
      },
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

    return memberships.flatMap((m) => m.course.exams);
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

  async getExamsForCourseForStudent(
    courseId: string,
    studentId: string,
  ): Promise<ExamResponseDto[]> {
    // 1. Get all assigned exams for this student in this course (upcoming only)
    const assignments = await this.prisma.assignedExam.findMany({
      where: {
        student_id: studentId,
        exam: {
          course_id: courseId,
          end_date: { gt: new Date() }, // Only upcoming exams
        },
      },
      include: {
        exam: {
          include: {
            course: { select: { title: true } }, // Optional: include course title
          },
        },
      },
      orderBy: {
        exam: {
          start_date: 'asc',
        },
      },
    });

    // 2. Filter and map exams based on allowed attempts
    const exams: ExamResponseDto[] = [];

    for (const assignment of assignments) {
      const exam = assignment.exam;

      // Count submissions for this student + exam
      const attemptsUsed = await this.prisma.examSubmission.count({
        where: {
          student_id: studentId,
          exam_id: exam.exam_id,
        },
      });

      const remainingAttempts = Math.max(
        0,
        exam.allowed_attempts - attemptsUsed,
      );

      // Only include exams with remaining attempts
      if (remainingAttempts > 0) {
        exams.push({
          exam_id: exam.exam_id,
          title: exam.title,
          description: exam.description,
          type: exam.type,
          start_date: exam.start_date,
          end_date: exam.end_date,
          course_id: exam.course_id,
          attempts_used: attemptsUsed, // ✅ For frontend display
          remaining_attempts: remainingAttempts, // ✅ For frontend display
        });
      }
    }

    return exams;
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
