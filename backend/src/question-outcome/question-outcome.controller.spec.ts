import { Test, TestingModule } from '@nestjs/testing';
import { QuestionOutcomeController } from './question-outcome.controller';

describe('QuestionOutcomeController', () => {
  let controller: QuestionOutcomeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionOutcomeController],
    }).compile();

    controller = module.get<QuestionOutcomeController>(
      QuestionOutcomeController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
