import { Controller, Post, Body, Get } from '@nestjs/common';
import { TeachesService } from './teaches.service';
import { CreateTeachesDto } from './create-teaches.dto';
import { TeachesResponseDto } from './teaches-response.dto';

@Controller('teaches')
export class TeachesController {
  constructor(private readonly teachesService: TeachesService) {}

  @Post()
  async create(@Body() dto: CreateTeachesDto): Promise<TeachesResponseDto> {
    return this.teachesService.create(dto);
  }

  @Get()
  async findAll(): Promise<TeachesResponseDto[]> {
    return this.teachesService.findAll();
  }
}
