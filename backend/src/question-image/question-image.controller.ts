import { Controller, Post, Get, Body } from '@nestjs/common';
import { QuestionImageService } from './question-image.service';
import { CreateQuestionImageDto } from './create-question-image.dto';
import { QuestionImageResponseDto } from './question-image-response.dto';

@Controller('question-images')
export class QuestionImageController {
  constructor(private readonly imageService: QuestionImageService) {}

  @Post()
  async create(@Body() dto: CreateQuestionImageDto): Promise<QuestionImageResponseDto> {
    return this.imageService.create(dto);
  }

  @Get()
  async findAll(): Promise<QuestionImageResponseDto[]> {
    return this.imageService.findAll();
  }
}
