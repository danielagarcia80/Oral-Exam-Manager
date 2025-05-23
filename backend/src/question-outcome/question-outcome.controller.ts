import { Controller, Post, Get, Body } from '@nestjs/common';
import { QuestionOutcomeService } from './question-outcome.service';
import { CreateQuestionOutcomeDto } from './create-question-outcome.dto';
import { QuestionOutcomeResponseDto } from './question-outcome-response.dto';

@Controller('question-outcomes')
export class QuestionOutcomeController {
  constructor(private readonly service: QuestionOutcomeService) {}

  @Post()
  async create(
    @Body() dto: CreateQuestionOutcomeDto,
  ): Promise<QuestionOutcomeResponseDto> {
    return this.service.create(dto);
  }

  @Get()
  async findAll(): Promise<QuestionOutcomeResponseDto[]> {
    return this.service.findAll();
  }
}
