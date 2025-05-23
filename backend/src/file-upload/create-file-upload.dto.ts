import { IsString } from 'class-validator';

export class CreateFileUploadDto {
  @IsString()
  question_id: string;

  @IsString()
  file_name: string;

  @IsString()
  file_type: string;

  @IsString()
  file_url: string;
}
