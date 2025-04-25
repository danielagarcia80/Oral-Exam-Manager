import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ExamSubmissionService } from './exam-submission.service';
import { CreateExamSubmissionDto } from './create-exam-submission.dto';
import { ExamSubmissionResponseDto } from './exam-submission-response.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('exam-submissions')
export class ExamSubmissionController {
  constructor(private readonly service: ExamSubmissionService) {}

  @Post()
  async create(
    @Body() dto: CreateExamSubmissionDto,
  ): Promise<ExamSubmissionResponseDto> {
    return this.service.create(dto);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAndTranscribe(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { student_id: string; exam_id: string },
  ) {
    return this.service.uploadAndTranscribe(
      file,
      body.student_id,
      body.exam_id,
    );
  }

  @Get()
  async findAll(): Promise<ExamSubmissionResponseDto[]> {
    return this.service.findAll();
  }

  @Get('exam/:examId')
  getSubmissionsByExam(@Param('examId') examId: string) {
    return this.service.findByExamId(examId);
  }
  @Patch('grade')
  async submitGrade(
    @Body()
    body: {
      student_id: string;
      exam_id: string;
      grade_percentage: number;
      feedback: string;
    },
  ) {
    return this.service.updateGrade(
      body.student_id,
      body.exam_id,
      body.grade_percentage,
      body.feedback,
    );
  }
}
