import { Module } from '@nestjs/common';
import { ExamService } from './exam.service';
import { ExamController } from './exam.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AssignedExamService } from './assigned-exam.service';

@Module({
  controllers: [ExamController],
  providers: [ExamService, PrismaService, AssignedExamService],
})
export class ExamModule {}
