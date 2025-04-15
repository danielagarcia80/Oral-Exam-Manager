import { Test, TestingModule } from '@nestjs/testing';
import { RecordingUploadService } from './recording-upload.service';

describe('RecordingUploadService', () => {
  let service: RecordingUploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecordingUploadService],
    }).compile();

    service = module.get<RecordingUploadService>(RecordingUploadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
