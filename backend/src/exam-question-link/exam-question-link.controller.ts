import { Controller, Post, Get, Body } from '@nestjs/common';
import { ExamQuestionLinkService } from './exam-question-link.service';
import { CreateExamQuestionLinkDto } from './create-exam-question-link.dto';
import { ExamQuestionLinkResponseDto } from './exam-question-link-response.dto';

@Controller('exam-question-links')
export class ExamQuestionLinkController {
  constructor(private readonly service: ExamQuestionLinkService) {}

  @Post()
  async create(@Body() dto: CreateExamQuestionLinkDto): Promise<ExamQuestionLinkResponseDto> {
    return this.service.create(dto);
  }

  @Get()
  async findAll(): Promise<ExamQuestionLinkResponseDto[]> {
    return this.service.findAll();
  }
}
