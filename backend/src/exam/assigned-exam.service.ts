import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service'; // Adjust path if needed

@Injectable()
export class AssignedExamService {
  constructor(private readonly prisma: PrismaService) {}

  async assignStudentsToExam(
    examId: string,
    studentIds?: string[],
    forceManual = false, // 👈 new param
  ) {
    // Step 1: Remove all existing assignments
    await this.prisma.assignedExam.deleteMany({
      where: { exam_id: examId },
    });

    // Step 2: Decide what studentIds to assign
    if ((!studentIds || studentIds.length === 0) && !forceManual) {
      const exam = await this.prisma.exam.findUnique({
        where: { exam_id: examId },
        select: {
          course_id: true,
        },
      });

      if (!exam) throw new Error('Exam not found');

      const memberships = await this.prisma.courseMembership.findMany({
        where: {
          courseId: exam.course_id,
          role: 'STUDENT',
        },
        select: {
          userId: true,
        },
      });

      studentIds = memberships.map((m) => m.userId);
    }

    if (!studentIds || studentIds.length === 0) {
      return { message: 'No students to assign' }; // 👈 prevents Prisma error
    }

    const data = studentIds.map((studentId) => ({
      exam_id: examId,
      student_id: studentId,
    }));

    return this.prisma.assignedExam.createMany({ data });
  }

  // Get all assigned students for a specific exam
  async getAssignedStudents(examId: string) {
    return this.prisma.assignedExam.findMany({
      where: { exam_id: examId },
      include: {
        student: {
          select: {
            user_id: true,
            first_name: true,
            last_name: true,
            email: true,
          },
        },
      },
    });
  }
}
