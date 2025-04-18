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
    // Step 1: Get courseIds the instructor teaches
    const instructorCourses = await this.prisma.courseMembership.findMany({
      where: {
        userId: instructorId,
        role: 'INSTRUCTOR',
      },
      select: { courseId: true },
    });

    const courseIds = instructorCourses.map((c) => c.courseId);
    if (courseIds.length === 0) return [];

    // Step 2: Get all students in those courses
    const studentMemberships = await this.prisma.courseMembership.findMany({
      where: {
        courseId: { in: courseIds },
        role: 'STUDENT',
      },
      select: { userId: true },
    });

    const studentIds = [...new Set(studentMemberships.map((s) => s.userId))];
    if (studentIds.length === 0) return [];

    // Step 3: Fetch user data
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
