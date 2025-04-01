import { Test, TestingModule } from '@nestjs/testing';
import { QuestionKeywordService } from './question-keyword.service';

describe('QuestionKeywordService', () => {
  let service: QuestionKeywordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuestionKeywordService],
    }).compile();

    service = module.get<QuestionKeywordService>(QuestionKeywordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
