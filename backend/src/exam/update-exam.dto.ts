import {
  IsString,
  IsOptional,
  IsDateString,
  IsEnum,
  IsArray,
  IsInt,
  Min,
} from 'class-validator';
import { ExamType } from '@prisma/client';

export class UpdateExamDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(ExamType)
  type?: ExamType;

  @IsOptional()
  @IsDateString()
  start_date?: string;

  @IsOptional()
  @IsDateString()
  end_date?: string;

  @IsOptional()
  @IsArray()
  questionIds?: string[];

  @IsOptional()
  @IsInt()
  @Min(1)
  duration_minutes?: number; // 👈 ADD THIS
}
