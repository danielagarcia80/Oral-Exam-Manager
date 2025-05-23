import {
  Controller,
  Post,
  Get,
  Body,
  UseInterceptors,
  UploadedFile,
  Query,
  BadRequestException,
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
  getCourseImages(@Query('courseId') courseId: string) {
    console.log('GET /question-images?courseId=', courseId); // ✅
    if (!courseId) throw new BadRequestException('Missing courseId');
    return this.imageService.findByCourse(courseId);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Query('courseId') courseId: string, // ✅ or @Body('courseId') if you're using body
  ) {
    if (!courseId) {
      throw new BadRequestException('Missing courseId');
    }
    return this.imageService.saveImage(file, courseId);
  }
}
