import { IsUUID } from 'class-validator';

export class CreateTeachesDto {
  @IsUUID()
  course_id: string;

  @IsUUID()
  instructor_id: string;
}
