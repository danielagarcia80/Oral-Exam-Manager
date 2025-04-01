import { Controller, Post, Get, Body } from '@nestjs/common';
import { KeywordService } from './keyword.service';
import { CreateKeywordDto } from './create-keyword.dto';
import { KeywordResponseDto } from './keyword-response.dto';

@Controller('keywords')
export class KeywordController {
  constructor(private readonly keywordService: KeywordService) {}

  @Post()
  async create(@Body() dto: CreateKeywordDto): Promise<KeywordResponseDto> {
    return this.keywordService.create(dto);
  }

  @Get()
  async findAll(): Promise<KeywordResponseDto[]> {
    return this.keywordService.findAll();
  }
}
