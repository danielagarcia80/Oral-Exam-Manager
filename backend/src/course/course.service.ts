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
    return courses.map(this.toCourseResponse);
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

  private toCourseResponse(course: any): CourseResponseDto {
    return {
      course_id: course.course_id,
      title: course.title,
      start_date: course.start_date,
      end_date: course.end_date,
    };
  }
}
