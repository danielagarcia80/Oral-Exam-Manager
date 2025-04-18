import { Test, TestingModule } from '@nestjs/testing';
import { CourseMembershipService } from './course-membership.service';

describe('CourseMembershipService', () => {
  let service: CourseMembershipService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CourseMembershipService],
    }).compile();

    service = module.get<CourseMembershipService>(CourseMembershipService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
