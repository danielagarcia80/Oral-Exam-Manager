import { IsInt, IsString } from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  text: string;

  @IsInt()
  difficulty: number;

  @IsString()
  type: string;

  @IsString()
  source: string;

  @IsInt()
  max_duration_minutes: number;
}
