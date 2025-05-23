import { Controller, Post, Body, Get } from '@nestjs/common';
import { LearningOutcomeService } from './learning-outcome.service';
import { CreateLearningOutcomeDto } from './create-learning-outcome.dto';
import { LearningOutcomeResponseDto } from './learning-outcome-response.dto';

@Controller('learning-outcomes')
export class LearningOutcomeController {
  constructor(private readonly service: LearningOutcomeService) {}

  @Post()
  async create(
    @Body() dto: CreateLearningOutcomeDto,
  ): Promise<LearningOutcomeResponseDto> {
    return this.service.create(dto);
  }

  @Get()
  async findAll(): Promise<LearningOutcomeResponseDto[]> {
    return this.service.findAll();
  }
}
