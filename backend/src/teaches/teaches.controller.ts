import { Controller, Post, Get, Param, Body, Delete } from '@nestjs/common';
import { TeachesService } from './teaches.service';
import { CreateTeachesDto } from './create-teaches.dto';
import { TeachesResponseDto } from './teaches-response.dto';

@Controller('teaches')
export class TeachesController {
  constructor(private readonly teachesService: TeachesService) {}

  @Post()
  create(@Body() dto: CreateTeachesDto): Promise<TeachesResponseDto> {
    return this.teachesService.create(dto);
  }

  @Get()
  findAll(): Promise<TeachesResponseDto[]> {
    return this.teachesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<TeachesResponseDto> {
    return this.teachesService.findOne(id);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<TeachesResponseDto> {
    return this.teachesService.delete(id);
  }
}
