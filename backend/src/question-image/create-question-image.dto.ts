import { IsString } from 'class-validator';

export class CreateQuestionImageDto {
  @IsString()
  image_data: string;

  @IsString()
  original_filename: string;

  @IsString()
  course_id: string;
}
