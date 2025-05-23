'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Header } from './0_Header/Header';
import { CourseCards } from './1_CourseCards/CourseCards';
import { UpcomingExams } from './2_UpcomingExams/UpcomingExams';
import { PastExams } from './3_PastExams/PastExams';
import { Container, Stack } from '@mantine/core';
import { InstructorExams } from './2_InstructorExams/InstructorExams';
import { EnrolledStudents } from './3_EnrolledStudents/EnrolledStudents';


export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  const isFaculty = session!.user!.role === 'FACULTY';

  return (
    <Container pt="md">
      <Stack gap="lg">
        <Header />
        <CourseCards isFaculty={isFaculty} />
        {isFaculty ? (
          <>
            <InstructorExams />
            <EnrolledStudents />
          </>
        ) : (
          <>
            <UpcomingExams />
            <PastExams />
          </>
        )}
      </Stack>
    </Container>
  );
}
