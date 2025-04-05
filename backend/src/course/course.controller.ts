// Lint was being incredibly frustrating with this file
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// TODO: fix lint issues
import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Delete,
  UseInterceptors,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseResponseDto } from './course-response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { StudentDto } from './student.dto';

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('banner', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueFilename = `${uuidv4()}${extname(file?.originalname || '')}`;
          cb(null, uniqueFilename);
        },
      }),
    }),
  )
  async createCourse(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
    @Req() req: any,
  ) {
    const instructor_id = req.user.user_id;

    const banner_url = file ? `uploads/${file.filename}` : null;

    const invites = JSON.parse(body.invites ?? '[]') as {
      email: string;
      role: 'STUDENT' | 'INSTRUCTOR';
    }[];

    return this.courseService.create({
      title: body.title,
      description: body.description,
      start_date: new Date(body.start_date),
      end_date: new Date(body.end_date),
      banner_url,
      instructor_id,
      invites,
    });
  }

  @Get()
  findAll(): Promise<CourseResponseDto[]> {
    return this.courseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<CourseResponseDto> {
    return this.courseService.findOne(id);
  }

  @Get(':courseId/details')
  getCourseDetails(@Param('courseId') courseId: string) {
    return this.courseService.getCourseDetails(courseId);
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

  @Get(':courseId/question-bank')
  getCourseQuestionBank(@Param('courseId') courseId: string) {
    return this.courseService.getCourseQuestionBank(courseId);
  }

  @Get(':courseId/students')
  getStudentsForCourse(
    @Param('courseId') courseId: string,
  ): Promise<StudentDto[]> {
    return this.courseService.getStudentsForCourse(courseId);
  }
}
