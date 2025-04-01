import { Module } from '@nestjs/common';
import { QuestionOutcomeService } from './question-outcome.service';
import { QuestionOutcomeController } from './question-outcome.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [QuestionOutcomeController],
  providers: [QuestionOutcomeService, PrismaService],
})
export class QuestionOutcomeModule {}
