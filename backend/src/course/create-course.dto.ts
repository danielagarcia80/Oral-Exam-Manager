export class CreateCourseDto {
  title: string;
  description?: string;
  start_date: Date;
  end_date: Date;
  banner_url?: string;
}
