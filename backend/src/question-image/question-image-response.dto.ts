import { IsString, IsOptional } from 'class-validator';

export class QuestionImageResponseDto {
  @IsString()
  image_id: string;

  @IsString()
  filename: string;

  @IsString()
  path: string;

  @IsOptional()
  @IsString()
  message?: string;
}
