import { Test, TestingModule } from '@nestjs/testing';
import { QuestionImageController } from './question-image.controller';

describe('QuestionImageController', () => {
  let controller: QuestionImageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionImageController],
    }).compile();

    controller = module.get<QuestionImageController>(QuestionImageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
