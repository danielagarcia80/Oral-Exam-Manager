export class ExamResponseDto {
  exam_id: string;
  title: string;
  description: string;
  type: string;
  start_date: Date;
  end_date: Date;
  course_id: string;
  attempts_used?: number;
  remaining_attempts?: number;
}
