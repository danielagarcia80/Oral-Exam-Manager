import { IsString } from 'class-validator';

export class CreateCourseLearningOutcomeDto {
  @IsString()
  course_id: string;

  @IsString()
  learning_outcome_id: string;
}
