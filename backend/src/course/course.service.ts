import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourseDto } from './create-course.dto';
import { CourseResponseDto } from './course-response.dto';
import { StudentDto } from './student.dto';

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) {}

  async create(
    data: CreateCourseDto & {
      instructor_id: string;
      invites?: { email: string; role: 'STUDENT' | 'INSTRUCTOR' }[];
    },
  ): Promise<CourseResponseDto> {
    // Destructure instructor_id and invites
    const { instructor_id, invites, ...courseData } = data;

    // Create the course
    const course = await this.prisma.course.create({
      data: courseData,
    });

    // Link the creating instructor
    await this.prisma.teaches.create({
      data: {
        instructor_id,
        course_id: course.course_id,
      },
    });

    // 👇 Handle additional invites if provided
    if (invites?.length) {
      for (const invite of invites) {
        // console.log('[CreateCourse] Processing invite:', invite);
        const user = await this.prisma.user.findUnique({
          where: { email: invite.email },
        });

        if (!user) {
          // console.warn(`[CourseService] User not found: ${invite.email}`);
          continue;
        }

        if (invite.role === 'STUDENT') {
          if (user.role !== 'STUDENT') {
            // console.warn(
            //   `[CourseService] Role mismatch: ${invite.email} is not a STUDENT`,
            // );
            continue;
          }

          // console.log(`[CreateCourse] Enrolling student: ${invite.email}`);
          await this.prisma.enrollment.create({
            data: {
              student_id: user.user_id,
              course_id: course.course_id,
              status: 'ACTIVE',
            },
          });
        } else if (invite.role === 'INSTRUCTOR') {
          if (user.role !== 'INSTRUCTOR') {
            // console.warn(
            //   `[CourseService] Role mismatch: ${invite.email} is not an INSTRUCTOR`,
            // );
            continue;
          }

          // console.log(`[CreateCourse] Adding instructor: ${invite.email}`);
          await this.prisma.teaches.create({
            data: {
              instructor_id: user.user_id,
              course_id: course.course_id,
            },
          });
        }
      }
    }

    // ✅ Return the course as a DTO
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
    const enrollments = await this.prisma.enrollment.findMany({
      where: { student_id: userId },
      include: { course: true },
    });

    return enrollments.map((enrollment) =>
      this.toCourseResponse(enrollment.course),
    );
  }

  async getCoursesForInstructor(userId: string): Promise<CourseResponseDto[]> {
    const teaches = await this.prisma.teaches.findMany({
      where: { instructor_id: userId },
      include: { course: true },
    });

    return teaches.map((teaching) => this.toCourseResponse(teaching.course));
  }

  async getCourseDetails(courseId: string) {
    const course = await this.prisma.course.findUnique({
      where: { course_id: courseId },
      include: {
        teaches: {
          include: { instructor: true }, // user relation
        },
        enrollments: true,
      },
    });

    if (!course) throw new NotFoundException('Course not found');

    const instructorNames = course.teaches.map((t) => {
      const first = t.instructor?.first_name || '';
      const last = t.instructor?.last_name || '';
      return `${first} ${last}`.trim();
    });

    const numStudents = course.enrollments.length;

    return {
      title: course.title,
      description: course.description,
      start_date: course.start_date,
      end_date: course.end_date,
      instructors: instructorNames,
      numStudents,
      banner_url: course.banner_url,
    };
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
                      include: {
                        image: true,
                      },
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
    const enrollments = await this.prisma.enrollment.findMany({
      where: { course_id: courseId },
      include: {
        student: true,
      },
    });

    return enrollments.map((e) => ({
      user_id: e.student.user_id,
      email: e.student.email,
      first_name: e.student.first_name,
      last_name: e.student.last_name,
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

      if (!user) continue;

      // 🚫 User role mismatch — skip
      if (user.role !== invite.role) {
        console.warn(
          `Skipped ${user.email} — account role is ${user.role}, tried to invite as ${invite.role}`,
        );
        continue;
      }

      if (invite.role === 'INSTRUCTOR') {
        const alreadyTeaches = await this.prisma.teaches.findFirst({
          where: {
            course_id: courseId,
            instructor_id: user.user_id,
          },
        });

        if (!alreadyTeaches) {
          await this.prisma.teaches.create({
            data: {
              course: { connect: { course_id: courseId } },
              instructor: { connect: { user_id: user.user_id } },
            },
          });
        }
      } else {
        const alreadyEnrolled = await this.prisma.enrollment.findFirst({
          where: {
            course_id: courseId,
            student_id: user.user_id,
          },
        });

        if (!alreadyEnrolled) {
          await this.prisma.enrollment.create({
            data: {
              course: { connect: { course_id: courseId } },
              student: { connect: { user_id: user.user_id } },
              status: 'ENROLLED',
            },
          });
        }
      }
    }
  }
}
