import { IsEnum, IsString } from 'class-validator';
import { CourseRole } from '@prisma/client';

export class UpdateCourseMembershipDto {
  @IsString()
  userId: string;

  @IsString()
  courseId: string;

  @IsEnum(CourseRole as unknown as object)
  newRole: CourseRole;
}
