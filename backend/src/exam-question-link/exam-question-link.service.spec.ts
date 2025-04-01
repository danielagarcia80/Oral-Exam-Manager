import { Test, TestingModule } from '@nestjs/testing';
import { ExamQuestionLinkService } from './exam-question-link.service';

describe('ExamQuestionLinkService', () => {
  let service: ExamQuestionLinkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExamQuestionLinkService],
    }).compile();

    service = module.get<ExamQuestionLinkService>(ExamQuestionLinkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
