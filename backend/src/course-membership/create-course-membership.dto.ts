// src/course-membership/dto/create-course-membership.dto.ts
import { IsEnum, IsString } from 'class-validator';
import { CourseRole } from '@prisma/client';

export class CreateCourseMembershipDto {
  @IsString()
  userId: string;

  @IsString()
  courseId: string;

  @IsEnum(CourseRole)
  role: CourseRole;
}
