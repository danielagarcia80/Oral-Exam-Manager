import { Controller, Post, Get, Body } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { CreateFileUploadDto } from './create-file-upload.dto';
import { FileUploadResponseDto } from './file-upload-response.dto';

@Controller('file-uploads')
export class FileUploadController {
  constructor(private readonly service: FileUploadService) {}

  @Post()
  async create(
    @Body() dto: CreateFileUploadDto,
  ): Promise<FileUploadResponseDto> {
    return this.service.create(dto);
  }

  @Get()
  async findAll(): Promise<FileUploadResponseDto[]> {
    return this.service.findAll();
  }
}
