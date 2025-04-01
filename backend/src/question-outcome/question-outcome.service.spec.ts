import { Test, TestingModule } from '@nestjs/testing';
import { QuestionOutcomeService } from './question-outcome.service';

describe('QuestionOutcomeService', () => {
  let service: QuestionOutcomeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuestionOutcomeService],
    }).compile();

    service = module.get<QuestionOutcomeService>(QuestionOutcomeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
