import { Module } from '@nestjs/common';
import { RecordingUploadService } from './recording-upload.service';
import { RecordingUploadController } from './recording-upload.controller';

@Module({
  providers: [RecordingUploadService],
  controllers: [RecordingUploadController],
})
export class RecordingUploadModule {}
