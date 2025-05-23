import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CourseRole, Prisma } from '@prisma/client';
import { CourseMembershipResponseDto } from './course-membership-response.dto';

@Injectable()
export class CourseMembershipService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: string,
    courseId: string,
    role: CourseRole,
  ): Promise<CourseMembershipResponseDto> {
    const membership = (await this.prisma.courseMembership.create({
      data: { userId, courseId, role },
      include: { user: true },
    })) as Prisma.CourseMembershipGetPayload<{ include: { user: true } }>;

    return this.mapToResponseDto(membership);
  }

  async findAllByCourse(
    courseId: string,
  ): Promise<CourseMembershipResponseDto[]> {
    const memberships = await this.prisma.courseMembership.findMany({
      where: { courseId },
      include: { user: true },
    });

    return memberships.map(this.mapToResponseDto);
  }

  async getUserRole(
    userId: string,
    courseId: string,
  ): Promise<CourseRole | null> {
    const membership = await this.prisma.courseMembership.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    return membership?.role ?? null;
  }

  async hasRole(
    userId: string,
    courseId: string,
    role: CourseRole,
  ): Promise<boolean> {
    const currentRole = await this.getUserRole(userId, courseId);
    return currentRole === role;
  }

  // Optionally: remove a user from a course
  async remove(userId: string, courseId: string): Promise<void> {
    await this.prisma.courseMembership.delete({
      where: {
        userId_courseId: { userId, courseId },
      },
    });
  }

  // Optionally: update a user's role
  async updateRole(
    userId: string,
    courseId: string,
    newRole: CourseRole,
  ): Promise<CourseMembershipResponseDto> {
    const membership = (await this.prisma.courseMembership.update({
      where: {
        userId_courseId: { userId, courseId },
      },
      data: {
        role: newRole,
      },
      include: {
        user: true,
      },
    })) as Prisma.CourseMembershipGetPayload<{ include: { user: true } }>;

    return this.mapToResponseDto(membership);
  }

  // Helper to map Prisma object to response DTO
  private mapToResponseDto = (
    membership: Prisma.CourseMembershipGetPayload<{ include: { user: true } }>,
  ): CourseMembershipResponseDto => {
    return {
      userId: membership.userId,
      courseId: membership.courseId,
      role: membership.role,
      user: {
        id: membership.user.user_id,
        name: membership.user.name,
        email: membership.user.email,
      },
    };
  };
}
