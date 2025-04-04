import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './create-user.dto';
import { UserResponseDto } from './user-response.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.prisma.user.create({ data });

    // Strip password from response
    const { password, ...safeUser } = user;
    return safeUser;
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.prisma.user.findMany();
    return users.map(({ password, ...user }) => user);
  }

  async getStudentsForInstructor(
    instructorId: string,
  ): Promise<UserResponseDto[]> {
    // Get courses the instructor teaches
    const teaches = await this.prisma.teaches.findMany({
      where: { instructor_id: instructorId },
      select: { course_id: true },
    });

    const courseIds = teaches.map((t) => t.course_id);
    if (courseIds.length === 0) return [];

    // Get enrollments for those courses
    const enrollments = await this.prisma.enrollment.findMany({
      where: { course_id: { in: courseIds } },
      select: { student_id: true },
    });

    const studentIds = [...new Set(enrollments.map((e) => e.student_id))];
    if (studentIds.length === 0) return [];

    // Get student user data
    const students = await this.prisma.user.findMany({
      where: { user_id: { in: studentIds } },
      select: {
        user_id: true,
        first_name: true,
        last_name: true,
        email: true,
        role: true,
        account_creation_date: true,
      },
    });

    return students;
  }
}
