'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { Container, Stack } from '@mantine/core';
import { Header } from './0_Header/Header';
import { CourseCards } from './1_CourseCards/CourseCards';
import { UpcomingExams } from './2_UpcomingExams/UpcomingExams';
import { PastExams } from './3_PastExams/PastExams';

export function StudentDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }), [status, router];

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  return (
    <Container pt="md">
      <Stack gap="lg">
        <Header studentName="Daniela" />
        <CourseCards />
        <UpcomingExams />
        <PastExams />
      </Stack>
    </Container>
  );
}
