import { Test, TestingModule } from '@nestjs/testing';
import { QuestionImageService } from './question-image.service';

describe('QuestionImageService', () => {
  let service: QuestionImageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuestionImageService],
    }).compile();

    service = module.get<QuestionImageService>(QuestionImageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
