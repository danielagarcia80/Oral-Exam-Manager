import { Module } from '@nestjs/common';
import { QuestionImageService } from './question-image.service';
import { QuestionImageController } from './question-image.controller';
import { PrismaService } from '../prisma/prisma.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads', // or configure memory if you want to stream
    }),
  ],
  controllers: [QuestionImageController],
  providers: [QuestionImageService, PrismaService],
})
export class QuestionImageModule {}
