import { Module } from '@nestjs/common';
import { QuestionImageService } from './question-image.service';
import { QuestionImageController } from './question-image.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [QuestionImageController],
  providers: [QuestionImageService, PrismaService],
})
export class QuestionImageModule {}
