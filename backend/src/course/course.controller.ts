import { Controller, Post, Get, Param, Body, Patch, Delete } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './create-course.dto';
import { CourseResponseDto } from './course-response.dto';
import { UpdateCourseDto } from './update-course.dto';

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

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCourseDto): Promise<CourseResponseDto> {
    return this.courseService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.courseService.delete(id);
  }
}
