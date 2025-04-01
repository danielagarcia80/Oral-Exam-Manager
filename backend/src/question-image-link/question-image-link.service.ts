import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestionImageLinkDto } from './create-question-image-link.dto';
import { QuestionImageLinkResponseDto } from './question-image-link-response.dto';

@Injectable()
export class QuestionImageLinkService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateQuestionImageLinkDto): Promise<QuestionImageLinkResponseDto> {
    const question = await this.prisma.question.findUnique({ where: { question_id: dto.question_id } });
    const image = await this.prisma.questionImages.findUnique({ where: { image_id: dto.image_id } });

    if (!question || !image) {
      throw new BadRequestException('Invalid question_id or image_id');
    }

    return this.prisma.questionHasImage.create({ data: dto });
  }

  async findAll(): Promise<QuestionImageLinkResponseDto[]> {
    return this.prisma.questionHasImage.findMany();
  }
}
