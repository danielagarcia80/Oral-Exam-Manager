import { IsString } from 'class-validator';

export class RemoveCourseMembershipDto {
  @IsString()
  userId: string;

  @IsString()
  courseId: string;
}
