import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateKeywordDto } from './create-keyword.dto';
import { KeywordResponseDto } from './keyword-response.dto';

@Injectable()
export class KeywordService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateKeywordDto): Promise<KeywordResponseDto> {
    try {
      return await this.prisma.keyword.create({ data: dto });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Keyword already exists');
      }
      throw error;
    }
  }

  async findAll(): Promise<KeywordResponseDto[]> {
    return this.prisma.keyword.findMany();
  }
}
