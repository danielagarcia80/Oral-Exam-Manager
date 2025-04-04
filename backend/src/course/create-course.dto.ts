import { IsString, IsDateString } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  title: string;

  @IsDateString()
  start_date: string;

  @IsDateString()
  end_date: string;
}
