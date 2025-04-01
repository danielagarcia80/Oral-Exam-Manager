import { Module } from '@nestjs/common';
import { KeywordService } from './keyword.service';
import { KeywordController } from './keyword.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [KeywordController],
  providers: [KeywordService, PrismaService],
})
export class KeywordModule {}
