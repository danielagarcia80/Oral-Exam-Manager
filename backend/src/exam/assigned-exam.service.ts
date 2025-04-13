import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service'; // Adjust path if needed

@Injectable()
export class AssignedExamService {
  constructor(private readonly prisma: PrismaService) {}

  async assignStudentsToExam(examId: string, studentIds?: string[]) {
    // Step 1: Delete existing assignments
    await this.prisma.assignedExam.deleteMany({
      where: { exam_id: examId },
    });

    // Step 2: If no studentIds are passed, assign to all enrolled students in the course
    if (!studentIds || studentIds.length === 0) {
      const exam = await this.prisma.exam.findUnique({
        where: { exam_id: examId },
        include: {
          course: {
            include: {
              enrollments: true,
            },
          },
        },
      });

      if (!exam) throw new Error('Exam not found');

      studentIds = exam.course.enrollments.map((e) => e.student_id);
    }

    // Step 3: Create assignments
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
            name: true,
            email: true,
          },
        },
      },
    });
  }
}
