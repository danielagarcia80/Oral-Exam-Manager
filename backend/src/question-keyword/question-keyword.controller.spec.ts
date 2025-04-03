import { Controller, Post, Get, Body } from '@nestjs/common';
import { QuestionKeywordService } from './question-keyword.service';
import { CreateQuestionKeywordDto } from './create-question-keyword.dto';
import { QuestionKeywordResponseDto } from './question-keyword-response.dto';

@Controller('question-keywords')
export class QuestionKeywordController {
  constructor(private readonly service: QuestionKeywordService) {}

  @Post()
  async create(
    @Body() dto: CreateQuestionKeywordDto,
  ): Promise<QuestionKeywordResponseDto> {
    return this.service.create(dto);
  }

  @Get()
  async findAll(): Promise<QuestionKeywordResponseDto[]> {
    return this.service.findAll();
  }
}
