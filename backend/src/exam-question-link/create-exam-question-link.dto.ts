import { IsInt, IsString } from 'class-validator';

export class CreateExamQuestionLinkDto {
  @IsString()
  exam_id: string;

  @IsString()
  question_id: string;

  @IsInt()
  order_index: number;
}
