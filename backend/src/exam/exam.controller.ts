import { Controller, Post, Body, Get } from '@nestjs/common';
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
}
