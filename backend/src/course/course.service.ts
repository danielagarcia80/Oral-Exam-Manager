import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourseDto } from './create-course.dto';
import { CourseResponseDto } from './course-response.dto';
import { StudentDto } from './student.dto';
import { CourseRole } from '@prisma/client';

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) {}

  async create(
    data: CreateCourseDto & {
      instructor_id: string;
      invites?: { email: string; role: 'STUDENT' | 'INSTRUCTOR' }[];
    },
  ): Promise<CourseResponseDto> {
    const { instructor_id, invites, ...courseData } = data;

    const course = await this.prisma.course.create({ data: courseData });

    await this.prisma.courseMembership.create({
      data: {
        userId: instructor_id,
        courseId: course.course_id,
        role: 'INSTRUCTOR',
      },
    });

    if (invites?.length) {
      for (const invite of invites) {
        const user = await this.prisma.user.findUnique({
          where: { email: invite.email },
        });

        if (!user || user.role !== invite.role) continue;

        const existingMembership =
          await this.prisma.courseMembership.findUnique({
            where: {
              userId_courseId: {
                userId: user.user_id,
                courseId: course.course_id,
              },
            },
          });

        if (!existingMembership) {
          await this.prisma.courseMembership.create({
            data: {
              userId: user.user_id,
              courseId: course.course_id,
              role: invite.role,
            },
          });
        }
      }
    }

    return this.toCourseResponse(course);
  }

  async findAll(): Promise<CourseResponseDto[]> {
    const courses = await this.prisma.course.findMany();
    return courses.map((course) => this.toCourseResponse(course));
  }

  async findOne(id: string): Promise<CourseResponseDto> {
    const course = await this.prisma.course.findUnique({
      where: { course_id: id },
    });
    return this.toCourseResponse(course);
  }

  async delete(id: string): Promise<CourseResponseDto> {
    const course = await this.prisma.course.delete({
      where: { course_id: id },
    });
    return this.toCourseResponse(course);
  }

  async getCoursesForStudent(userId: string): Promise<CourseResponseDto[]> {
    const memberships = await this.prisma.courseMembership.findMany({
      where: { userId, role: 'STUDENT' },
      include: { course: true },
    });

    return memberships.map((m) => this.toCourseResponse(m.course));
  }

  async getCoursesForInstructor(userId: string): Promise<CourseResponseDto[]> {
    const memberships = await this.prisma.courseMembership.findMany({
      where: { userId, role: 'INSTRUCTOR' },
      include: { course: true },
    });

    return memberships.map((m) => this.toCourseResponse(m.course));
  }

  async getCourseDetails(courseId: string) {
    const course = await this.prisma.course.findUnique({
      where: { course_id: courseId },
      include: {
        roles: {
          include: { user: true },
        },
      },
    });

    if (!course) throw new NotFoundException('Course not found');

    const instructors = course.roles.filter((m) => m.role === 'INSTRUCTOR');

    const students = course.roles.filter((m) => m.role === 'STUDENT');

    const instructorNames = instructors.map((i) => {
      const { first_name = '', last_name = '' } = i.user;
      return `${first_name} ${last_name}`.trim();
    });

    return {
      title: course.title,
      description: course.description,
      start_date: course.start_date,
      end_date: course.end_date,
      instructors: instructorNames,
      numStudents: students.length,
      banner_url: course.banner_url,
    };
  }

  async getCourseQuestionBank(courseId: string) {
    const outcomes = await this.prisma.courseLearningOutcome.findMany({
      where: { course_id: courseId },
      include: {
        learning_outcome: {
          include: {
            questions: {
              include: {
                question: {
                  include: {
                    images: {
                      include: { image: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    return outcomes.map((entry) => ({
      outcomeId: entry.learning_outcome.learning_outcome_id,
      description: entry.learning_outcome.description,
      questions: entry.learning_outcome.questions.map((qa) => qa.question),
    }));
  }

  async getStudentsForCourse(courseId: string): Promise<StudentDto[]> {
    const students = await this.prisma.courseMembership.findMany({
      where: { courseId, role: 'STUDENT' },
      include: { user: true },
    });

    return students.map((s) => ({
      user_id: s.user.user_id,
      email: s.user.email,
      first_name: s.user.first_name,
      last_name: s.user.last_name,
    }));
  }

  async inviteToCourse(
    courseId: string,
    invites: { email: string; role: 'STUDENT' | 'INSTRUCTOR' }[],
  ) {
    for (const invite of invites) {
      const user = await this.prisma.user.findUnique({
        where: { email: invite.email },
      });

      if (user !== null) {
        // Existing user → add to CourseMembership
        const existing = await this.prisma.courseMembership.findUnique({
          where: {
            userId_courseId: {
              userId: user.user_id, // ✅ user exists, safe to access
              courseId,
            },
          },
        });

        if (!existing) {
          await this.prisma.courseMembership.create({
            data: {
              userId: user.user_id,
              courseId,
              role: invite.role as CourseRole,
            },
          });
        }
      } else {
        // User not found → add pending invite
        await this.prisma.pendingCourseMembership.upsert({
          where: {
            email_courseId: {
              email: invite.email,
              courseId,
            },
          },
          update: {
            role: invite.role as CourseRole,
          },
          create: {
            email: invite.email,
            courseId,
            role: invite.role as CourseRole,
          },
        });
      }
    }
  }

  private toCourseResponse(course: {
    course_id: string;
    title: string;
    description: string;
    start_date: Date;
    end_date: Date;
    banner_url: string;
  }): CourseResponseDto {
    return {
      course_id: course.course_id,
      title: course.title,
      description: course.description,
      start_date: course.start_date,
      end_date: course.end_date,
      banner_url: course.banner_url,
    };
  }
}
