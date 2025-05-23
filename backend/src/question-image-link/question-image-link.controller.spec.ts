import { Test, TestingModule } from '@nestjs/testing';
import { QuestionImageLinkController } from './question-image-link.controller';

describe('QuestionImageLinkController', () => {
  let controller: QuestionImageLinkController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionImageLinkController],
    }).compile();

    controller = module.get<QuestionImageLinkController>(
      QuestionImageLinkController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
