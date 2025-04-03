'use client';

import { useRouter } from 'next/navigation';
import { Alert, Button, Container, Stack } from '@mantine/core';
import { Header } from './0_DemoHeader/DemoHeader';
import { CourseCards } from './1_DemoCourseCards/DemoCourseCards';
import { UpcomingExams } from './2_DemoUpcomingExams/DemoUpcomingExams';
import { PastExams } from './3_DemoPastExams/DemoPastExams';

export function DemoDashboard() {
  const router = useRouter();

  const handleGoBackHome = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/');
  };

  return (
    <>
      <Alert color="yellow" title="Demo Mode">
        This is a preview of a student dashboard. No data is saved.
      </Alert>
      <Button
        size="md"
        onClick={handleGoBackHome}
        variant="outline"
        color="gray"
        mt="md"
        mb="lg"
        mx="auto"
        display="block"
      >
        Go Home
      </Button>

      <Container pt="md">
        <Stack gap="lg">
          <Header studentName="Daniela" />
          <CourseCards />
          <UpcomingExams />
          <PastExams />
        </Stack>
      </Container>
    </>
  );
}
