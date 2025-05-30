import { Controller, Post, Get, Body, Delete, Param } from '@nestjs/common';
import { QuestionImageLinkService } from './question-image-link.service';
import { CreateQuestionImageLinkDto } from './create-question-image-link.dto';
import { QuestionImageLinkResponseDto } from './question-image-link-response.dto';

@Controller('question-image-links')
export class QuestionImageLinkController {
  constructor(private readonly service: QuestionImageLinkService) {}

  @Post()
  async create(
    @Body() dto: CreateQuestionImageLinkDto,
  ): Promise<QuestionImageLinkResponseDto> {
    return this.service.create(dto);
  }

  @Get()
  async findAll(): Promise<QuestionImageLinkResponseDto[]> {
    return this.service.findAll();
  }

  @Delete(':question_id')
  async deleteAllLinksForQuestion(@Param('question_id') questionId: string) {
    return this.service.deleteAllForQuestion(questionId);
  }
}
