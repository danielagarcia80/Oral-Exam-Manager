// Lint was being incredibly frustrating with this file
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
  UnauthorizedException,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseResponseDto } from './course-response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('banner'))
  async create(
    @UploadedFile() banner: Express.Multer.File,
    @Body() body: any,
    @Req() req: Request,
  ): Promise<CourseResponseDto> {
    const instructor_id = (req as any).user?.user_id;
    const invites = JSON.parse(body.invites ?? '[]') as {
      email: string;
      role: 'STUDENT' | 'INSTRUCTOR';
    }[];

    if (!instructor_id) {
      throw new UnauthorizedException('Instructor ID not found.');
    }

    return this.courseService.create({
      title: body.title,
      description: body.description,
      start_date: new Date(body.start_date),
      end_date: new Date(body.end_date),
      banner_url: banner ? `uploads/${banner.originalname}` : null,
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
