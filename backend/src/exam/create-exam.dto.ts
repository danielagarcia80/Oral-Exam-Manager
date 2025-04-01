import { IsDateString, IsEnum, IsString } from 'class-validator';
import { ExamType } from '@prisma/client';

export class CreateExamDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(ExamType)
  type: ExamType;

  @IsDateString()
  start_date: string;

  @IsDateString()
  end_date: string;

  @IsString()
  course_id: string;
}
