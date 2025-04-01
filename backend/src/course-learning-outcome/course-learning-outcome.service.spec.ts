import { Test, TestingModule } from '@nestjs/testing';
import { CourseLearningOutcomeService } from './course-learning-outcome.service';

describe('CourseLearningOutcomeService', () => {
  let service: CourseLearningOutcomeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CourseLearningOutcomeService],
    }).compile();

    service = module.get<CourseLearningOutcomeService>(CourseLearningOutcomeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
