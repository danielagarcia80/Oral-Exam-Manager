import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './create-course.dto';
import { CourseResponseDto } from './course-response.dto';
import { UpdateCourseDto } from './update-course.dto';

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCourseDto): Promise<CourseResponseDto> {
    return this.prisma.course.create({ data: dto });
  }

  async findAll(): Promise<CourseResponseDto[]> {
    return this.prisma.course.findMany();
  }

  async findOne(id: string): Promise<CourseResponseDto> {
    const course = await this.prisma.course.findUnique({ where: { course_id: id } });
    if (!course) throw new NotFoundException('Course not found');
    return course;
  }

  async update(id: string, dto: UpdateCourseDto): Promise<CourseResponseDto> {
    return this.prisma.course.update({ where: { course_id: id }, data: dto });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.course.delete({ where: { course_id: id } });
  }
}
