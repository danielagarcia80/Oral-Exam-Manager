import { Module } from '@nestjs/common';
import { CourseLearningOutcomeService } from './course-learning-outcome.service';
import { CourseLearningOutcomeController } from './course-learning-outcome.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [CourseLearningOutcomeController],
  providers: [CourseLearningOutcomeService, PrismaService],
})
export class CourseLearningOutcomeModule {}
