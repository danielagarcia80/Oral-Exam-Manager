import { Controller, Get, Post, Body } from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './create-question.dto';
import { QuestionResponseDto } from './question-response.dto';

@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  async create(@Body() dto: CreateQuestionDto): Promise<QuestionResponseDto> {
    return this.questionService.create(dto);
  }

  @Get()
  async findAll(): Promise<QuestionResponseDto[]> {
    return this.questionService.findAll();
  }
}
