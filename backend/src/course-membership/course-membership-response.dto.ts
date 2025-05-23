// course-membership-response.dto.ts
import { CourseRole } from '@prisma/client';

export class CourseMembershipResponseDto {
  userId: string;
  courseId: string;
  role: CourseRole;
  user: {
    id: string;
    name: string;
    email: string;
  };
}
