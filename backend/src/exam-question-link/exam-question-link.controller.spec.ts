import { Test, TestingModule } from '@nestjs/testing';
import { ExamQuestionLinkController } from './exam-question-link.controller';

describe('ExamQuestionLinkController', () => {
  let controller: ExamQuestionLinkController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExamQuestionLinkController],
    }).compile();

    controller = module.get<ExamQuestionLinkController>(
      ExamQuestionLinkController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
