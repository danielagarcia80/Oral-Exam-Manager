import { IsString } from 'class-validator';

export class CreateQuestionImageDto {
  @IsString()
  image_data: string; // Base64 string or image URL
}
