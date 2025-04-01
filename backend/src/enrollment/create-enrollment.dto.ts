import { IsString } from 'class-validator';

export class CreateEnrollmentDto {
  @IsString()
  student_id: string;

  @IsString()
  course_id: string;

  @IsString()
  status: string;
}
