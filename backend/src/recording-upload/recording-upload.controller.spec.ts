import { Test, TestingModule } from '@nestjs/testing';
import { RecordingUploadController } from './recording-upload.controller';

describe('RecordingUploadController', () => {
  let controller: RecordingUploadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecordingUploadController],
    }).compile();

    controller = module.get<RecordingUploadController>(RecordingUploadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
