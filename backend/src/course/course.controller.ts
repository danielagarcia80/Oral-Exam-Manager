import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CourseService } from './course.service';
// import { CreateCourseDto } from './create-course.dto';
import { CourseResponseDto } from './course-response.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @UseInterceptors(FileInterceptor('banner'))
  async create(
    @UploadedFile() banner: Express.Multer.File,
    @Body() body: Record<string, any>,
  ): Promise<CourseResponseDto> {
    const banner_url = banner ? `uploads/${banner.originalname}` : null;

    // manually build what CreateCourseDto would contain
    const data = {
      title: body.title,
      course_id: body.course_id,
      description: body.description,
      start_date: new Date(body.start_date),
      end_date: new Date(body.end_date),
      banner_url,
    };

    return this.courseService.create(data as any); // if needed, cast to `any` for now
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
