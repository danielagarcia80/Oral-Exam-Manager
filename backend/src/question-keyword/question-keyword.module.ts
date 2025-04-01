import { Module } from '@nestjs/common';
import { QuestionKeywordService } from './question-keyword.service';
import { QuestionKeywordController } from './question-keyword.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [QuestionKeywordController],
  providers: [QuestionKeywordService, PrismaService],
})
export class QuestionKeywordModule {}
