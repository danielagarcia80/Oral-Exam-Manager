import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ExamService } from './exam.service';
import { CreateExamDto } from './create-exam.dto';
import { ExamResponseDto } from './exam-response.dto';

@Controller('exams')
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @Post()
  async create(@Body() dto: CreateExamDto): Promise<ExamResponseDto> {
    return this.examService.create(dto);
  }

  @Get()
  async findAll(): Promise<ExamResponseDto[]> {
    return this.examService.findAll();
  }

  @Get('student/upcoming/:userId')
  getUpcomingExams(
    @Param('userId') userId: string,
  ): Promise<ExamResponseDto[]> {
    return this.examService.getUpcomingExamsForUser(userId);
  }

  @Get('instructor/:userId')
  getExamsForInstructor(
    @Param('userId') userId: string,
  ): Promise<ExamResponseDto[]> {
    return this.examService.getExamsForInstructor(userId);
  }

  @Get('student/past/:userId')
  getPastExams(@Param('userId') userId: string): Promise<ExamResponseDto[]> {
    return this.examService.getPastExamsForUser(userId);
  }

  @Get('student/:userId')
  getAllExamsForStudent(
    @Param('userId') userId: string,
  ): Promise<ExamResponseDto[]> {
    return this.examService.getAllExamsForStudent(userId);
  }

  @Get('course/:courseId')
  getExamsForCourse(
    @Param('courseId') courseId: string,
  ): Promise<ExamResponseDto[]> {
    return this.examService.getExamsForCourse(courseId);
  }
}
