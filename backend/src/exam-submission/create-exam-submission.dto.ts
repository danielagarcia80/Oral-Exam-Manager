import { IsString, IsNumber, IsDateString, IsOptional } from 'class-validator';

export class CreateExamSubmissionDto {
  @IsString()
  student_id: string;

  @IsString()
  exam_id: string;

  @IsNumber()
  attempt_number: number;

  @IsString()
  recording_url: string;

  @IsNumber()
  duration_minutes: number;

  @IsOptional()
  @IsNumber()
  grade_percentage: number;

  @IsOptional()
  @IsString()
  feedback: string;
}
