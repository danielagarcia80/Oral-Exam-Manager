import { Controller, Post, Get, Body } from '@nestjs/common';
import { ExamSubmissionService } from './exam-submission.service';
import { CreateExamSubmissionDto } from './create-exam-submission.dto';
import { ExamSubmissionResponseDto } from './exam-submission-response.dto';

@Controller('exam-submissions')
export class ExamSubmissionController {
  constructor(private readonly service: ExamSubmissionService) {}

  @Post()
  async create(
    @Body() dto: CreateExamSubmissionDto,
  ): Promise<ExamSubmissionResponseDto> {
    return this.service.create(dto);
  }

  @Get()
  async findAll(): Promise<ExamSubmissionResponseDto[]> {
    return this.service.findAll();
  }
}
