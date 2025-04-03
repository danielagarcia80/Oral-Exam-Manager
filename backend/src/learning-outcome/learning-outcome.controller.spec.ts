import { Test, TestingModule } from '@nestjs/testing';
import { LearningOutcomeController } from './learning-outcome.controller';

describe('LearningOutcomeController', () => {
  let controller: LearningOutcomeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LearningOutcomeController],
    }).compile();

    controller = module.get<LearningOutcomeController>(
      LearningOutcomeController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
