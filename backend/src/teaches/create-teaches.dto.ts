import { IsString } from 'class-validator';

export class CreateTeachesDto {
  @IsString()
  instructor_id: string;

  @IsString()
  course_id: string;
}
