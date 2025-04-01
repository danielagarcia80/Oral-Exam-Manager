import { Module } from '@nestjs/common';
import { ExamSubmissionService } from './exam-submission.service';
import { ExamSubmissionController } from './exam-submission.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ExamSubmissionController],
  providers: [ExamSubmissionService, PrismaService],
})
export class ExamSubmissionModule {}
