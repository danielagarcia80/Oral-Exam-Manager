import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourseDto } from './create-course.dto';
import { CourseResponseDto } from './course-response.dto';

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCourseDto): Promise<CourseResponseDto> {
    const course = await this.prisma.course.create({ data });
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

    return enrollments.map((enrollment) => ({
      course_id: enrollment.course.course_id,
      title: enrollment.course.title,
      start_date: enrollment.course.start_date,
      end_date: enrollment.course.end_date,
    }));
  }

  async getCoursesForInstructor(userId: string): Promise<CourseResponseDto[]> {
    const teaches = await this.prisma.teaches.findMany({
      where: { instructor_id: userId },
      include: { course: true },
    });

    return teaches.map((teaching) => ({
      course_id: teaching.course.course_id,
      title: teaching.course.title,
      start_date: teaching.course.start_date,
      end_date: teaching.course.end_date,
    }));
  }

  private toCourseResponse(course: {
    course_id: string;
    title: string;
    start_date: Date;
    end_date: Date;
  }): CourseResponseDto {
    return {
      course_id: course.course_id,
      title: course.title,
      start_date: course.start_date,
      end_date: course.end_date,
    };
  }
}
