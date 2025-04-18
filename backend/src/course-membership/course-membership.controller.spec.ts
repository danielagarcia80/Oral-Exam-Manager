import { Test, TestingModule } from '@nestjs/testing';
import { CourseMembershipController } from './course-membership.controller';

describe('CourseMembershipController', () => {
  let controller: CourseMembershipController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourseMembershipController],
    }).compile();

    controller = module.get<CourseMembershipController>(CourseMembershipController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
