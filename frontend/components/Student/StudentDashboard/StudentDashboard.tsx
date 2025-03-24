import { Container, Stack } from '@mantine/core';
import { Header } from './0_Header/Header';
import { CourseCards } from './1_CourseCards/CourseCards';
import { UpcomingExams } from './2_UpcomingExams/UpcomingExams';
import { PastExams } from './3_PastExams/PastExams';

export function StudentDashboard() {
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
