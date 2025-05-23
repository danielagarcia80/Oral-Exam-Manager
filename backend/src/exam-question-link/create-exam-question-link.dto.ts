import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateExamQuestionLinkDto {
  @IsString()
  exam_id: string;

  @IsString()
  question_id: string;

  @IsInt()
  order_index: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  time_allocation?: number;
}
