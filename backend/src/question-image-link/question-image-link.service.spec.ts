import { Test, TestingModule } from '@nestjs/testing';
import { QuestionImageLinkService } from './question-image-link.service';

describe('QuestionImageLinkService', () => {
  let service: QuestionImageLinkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuestionImageLinkService],
    }).compile();

    service = module.get<QuestionImageLinkService>(QuestionImageLinkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
