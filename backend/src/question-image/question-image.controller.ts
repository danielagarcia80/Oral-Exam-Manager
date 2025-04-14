import {
  Controller,
  Post,
  Get,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { QuestionImageService } from './question-image.service';
import { CreateQuestionImageDto } from './create-question-image.dto';
import { QuestionImageResponseDto } from './question-image-response.dto';
import { FileInterceptor } from '@nestjs/platform-express/multer';

@Controller('question-images')
export class QuestionImageController {
  constructor(private readonly imageService: QuestionImageService) {}

  @Post()
  async create(
    @Body() dto: CreateQuestionImageDto,
  ): Promise<QuestionImageResponseDto> {
    return this.imageService.create(dto);
  }

  @Get()
  async findAll(): Promise<QuestionImageResponseDto[]> {
    return this.imageService.findAll();
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    // file.buffer or file.path depending on storage
    console.log('file received:', file);
    return this.imageService.saveImage(file);
  }
}
