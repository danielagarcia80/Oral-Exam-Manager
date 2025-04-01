import { Test, TestingModule } from '@nestjs/testing';
import { LearningOutcomeService } from './learning-outcome.service';

describe('LearningOutcomeService', () => {
  let service: LearningOutcomeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LearningOutcomeService],
    }).compile();

    service = module.get<LearningOutcomeService>(LearningOutcomeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
