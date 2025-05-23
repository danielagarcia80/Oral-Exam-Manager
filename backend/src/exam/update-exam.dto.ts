import {
  IsString,
  IsOptional,
  IsDateString,
  IsEnum,
  IsArray,
  IsInt,
  Min,
  IsBoolean,
  IsIn,
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

  @IsOptional()
  @IsBoolean()
  requires_audio?: boolean;

  @IsOptional()
  @IsBoolean()
  requires_video?: boolean;

  @IsOptional()
  @IsBoolean()
  requires_screen_share?: boolean;

  @IsOptional()
  @IsIn(['OVERALL', 'PER_QUESTION'])
  timing_mode?: 'OVERALL' | 'PER_QUESTION';

  @IsOptional()
  @IsInt()
  @Min(1)
  allowed_attempts?: number;
}
