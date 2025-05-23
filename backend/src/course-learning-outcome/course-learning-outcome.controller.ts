import { Controller, Post, Body, Get } from '@nestjs/common';
import { CourseLearningOutcomeService } from './course-learning-outcome.service';
import { CreateCourseLearningOutcomeDto } from './create-course-learning-outcome.dto';
import { CourseLearningOutcomeResponseDto } from './course-learning-outcome-response.dto';

@Controller('course-learning-outcomes')
export class CourseLearningOutcomeController {
  constructor(private readonly service: CourseLearningOutcomeService) {}

  @Post()
  async create(
    @Body() dto: CreateCourseLearningOutcomeDto,
  ): Promise<CourseLearningOutcomeResponseDto> {
    return this.service.create(dto);
  }

  @Get()
  async findAll(): Promise<CourseLearningOutcomeResponseDto[]> {
    return this.service.findAll();
  }
}
