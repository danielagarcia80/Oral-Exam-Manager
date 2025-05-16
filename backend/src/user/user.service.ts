import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './create-user.dto';
import { UserResponseDto } from './user-response.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        first_name: data.first_name,
        last_name: data.last_name,
        role: data.role,
        account_creation_date: new Date().toISOString(),
      },
    });

    console.log('User created:', user);
    await this.assignPendingMembershipsForUser(user);

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

  private async assignPendingMembershipsForUser(user: {
    user_id: string;
    email: string;
  }) {
    console.log('Assigning pending memberships for user:', user.email);
    // 1. Find any pending invites for this email
    const pendingInvites = await this.prisma.pendingCourseMembership.findMany({
      where: { email: user.email },
    });

    // 2. Create CourseMemberships for each invite
    for (const invite of pendingInvites) {
      // Check if user is already a member (just in case)
      const existing = await this.prisma.courseMembership.findUnique({
        where: {
          userId_courseId: {
            userId: user.user_id,
            courseId: invite.courseId,
          },
        },
      });

      if (!existing) {
        await this.prisma.courseMembership.create({
          data: {
            userId: user.user_id,
            courseId: invite.courseId,
            role: invite.role,
          },
        });
      }
    }

    // 3. Clean up (remove pending invites for this user)
    await this.prisma.pendingCourseMembership.deleteMany({
      where: { email: user.email },
    });
  }
}
