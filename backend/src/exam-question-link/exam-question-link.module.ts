import { Module } from '@nestjs/common';
import { ExamQuestionLinkService } from './exam-question-link.service';
import { ExamQuestionLinkController } from './exam-question-link.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ExamQuestionLinkController],
  providers: [ExamQuestionLinkService, PrismaService],
})
export class ExamQuestionLinkModule {}
