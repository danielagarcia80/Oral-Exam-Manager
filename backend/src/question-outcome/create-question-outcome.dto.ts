import { IsString } from 'class-validator';

export class CreateQuestionOutcomeDto {
  @IsString()
  question_id: string;

  @IsString()
  learning_outcome_id: string;
}
