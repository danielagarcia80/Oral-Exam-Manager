import { Module } from '@nestjs/common';
import { QuestionImageLinkService } from './question-image-link.service';
import { QuestionImageLinkController } from './question-image-link.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [QuestionImageLinkController],
  providers: [QuestionImageLinkService, PrismaService],
})
export class QuestionImageLinkModule {}
