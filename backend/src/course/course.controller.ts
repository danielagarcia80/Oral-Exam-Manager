import { Controller, Post, Get, Param, Body, Delete } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './create-course.dto';
import { CourseResponseDto } from './course-response.dto';

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  create(@Body() dto: CreateCourseDto): Promise<CourseResponseDto> {
    return this.courseService.create(dto);
  }

  @Get()
  findAll(): Promise<CourseResponseDto[]> {
    return this.courseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<CourseResponseDto> {
    return this.courseService.findOne(id);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<CourseResponseDto> {
    return this.courseService.delete(id);
  }

  @Get('student/:userId')
  getCoursesForStudent(
    @Param('userId') userId: string,
  ): Promise<CourseResponseDto[]> {
    return this.courseService.getCoursesForStudent(userId);
  }

  @Get('instructor/:userId')
  getCoursesForInstructor(
    @Param('userId') userId: string,
  ): Promise<CourseResponseDto[]> {
    return this.courseService.getCoursesForInstructor(userId);
  }
}
