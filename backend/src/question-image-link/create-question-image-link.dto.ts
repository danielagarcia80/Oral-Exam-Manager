import { IsString } from 'class-validator';

export class CreateQuestionImageLinkDto {
  @IsString()
  question_id: string;

  @IsString()
  image_id: string;
}
