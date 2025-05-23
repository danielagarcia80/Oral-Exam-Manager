import { IsString } from 'class-validator';

export class CreateQuestionKeywordDto {
  @IsString()
  question_id: string;

  @IsString()
  keyword_id: string;
}
