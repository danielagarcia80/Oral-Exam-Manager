import { Test, TestingModule } from '@nestjs/testing';
import { CourseLearningOutcomeController } from './course-learning-outcome.controller';

describe('CourseLearningOutcomeController', () => {
  let controller: CourseLearningOutcomeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourseLearningOutcomeController],
    }).compile();

    controller = module.get<CourseLearningOutcomeController>(
      CourseLearningOutcomeController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
