import { Controller, Post, Body, Get, Param, Put, Patch } from '@nestjs/common';
import { ExamService } from './exam.service';
import { CreateExamDto } from './create-exam.dto';
import { ExamResponseDto } from './exam-response.dto';
import { UpdateExamDto } from './update-exam.dto';
import { AssignedExamService } from './assigned-exam.service';

@Controller('exams')
export class ExamController {
  constructor(
    private readonly examService: ExamService,
    private readonly assignedExamService: AssignedExamService,
  ) {}

  @Post()
  async create(@Body() dto: CreateExamDto) {
    try {
      console.log('[ExamController] DTO:', dto);
      return await this.examService.create(dto);
    } catch (err) {
      console.error('❌ Create exam failed:', err);
      throw err;
    }
  }

  @Get(':id')
  getExamById(@Param('id') id: string) {
    return this.examService.findById(id);
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

  @Put(':id')
  updateExam(@Param('id') id: string, @Body() updateExamDto: UpdateExamDto) {
    return this.examService.update(id, updateExamDto);
  }

  @Patch(':examId/assigned-students')
  async assignStudentsToExam(
    @Param('examId') examId: string,
    @Body('studentIds') studentIds?: string[],
  ) {
    return this.assignedExamService.assignStudentsToExam(
      examId,
      studentIds,
      true,
    ); // 👈 force manual for edit
  }

  @Get(':examId/assigned-students')
  getAssignedStudents(@Param('examId') examId: string) {
    return this.assignedExamService.getAssignedStudents(examId);
  }
}
