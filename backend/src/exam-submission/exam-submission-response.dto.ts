export class ExamSubmissionResponseDto {
  submission_id: string;
  student_id: string;
  exam_id: string;
  submitted_at: Date;
  attempt_number: number;
  recording_url: string;
  duration_minutes: number;
  grade_percentage: number;
  feedback: string;
}
