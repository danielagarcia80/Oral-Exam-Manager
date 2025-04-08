import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsString,
  Min,
} from 'class-validator';
import { ExamType, TimingMode } from '@prisma/client';

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

  @IsInt()
  @Min(1)
  duration_minutes: number;

  @IsEnum(TimingMode)
  timing_mode: TimingMode;

  @IsBoolean()
  requires_audio: boolean;

  @IsBoolean()
  requires_video: boolean;

  @IsBoolean()
  requires_screen_share: boolean;
}
