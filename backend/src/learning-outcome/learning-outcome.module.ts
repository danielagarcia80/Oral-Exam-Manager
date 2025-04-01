import { Module } from '@nestjs/common';
import { LearningOutcomeService } from './learning-outcome.service';
import { LearningOutcomeController } from './learning-outcome.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [LearningOutcomeController],
  providers: [LearningOutcomeService, PrismaService],
})
export class LearningOutcomeModule {}
