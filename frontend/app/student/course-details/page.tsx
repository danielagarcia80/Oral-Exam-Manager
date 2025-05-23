'use client';

import { CourseDetails } from '@/components/Student/CourseDetails/CourseDetails';
import { useParams } from 'next/navigation';

export default function Page() {
  const { id } = useParams() as { id: string };

  return <CourseDetails courseId={id} />;
}
