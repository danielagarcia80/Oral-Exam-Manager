import { IsString } from 'class-validator';

export class CreateLearningOutcomeDto {
  @IsString()
  description: string;
}
