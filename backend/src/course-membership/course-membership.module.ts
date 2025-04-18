import { Module } from '@nestjs/common';
import { CourseMembershipService } from './course-membership.service';
import { CourseMembershipController } from './course-membership.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [CourseMembershipService, PrismaService],
  controllers: [CourseMembershipController],
})
export class CourseMembershipModule {}
