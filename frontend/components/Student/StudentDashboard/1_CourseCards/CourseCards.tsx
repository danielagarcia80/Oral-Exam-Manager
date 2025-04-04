'use client';

import { Card, Grid, Text } from '@mantine/core';
import { useStudentDashboardStyles } from '../StudentDashboard.styles';

type Course = {
  id: string;
  name: string;
};

const mockCourses: Course[] = [
  { id: '1', name: 'Advanced Machine Learning' },
  { id: '2', name: 'Design and Analysis of Algorithms' },
  { id: '3', name: 'Operating Systems' },
  { id: '4', name: 'Software Engineering' },
  { id: '5', name: 'Data Structures' },
  { id: '6', name: 'Computer Networks' },
];

export function CourseCards() {
  const styles = useStudentDashboardStyles();

  return (
    <Grid gutter="md" mb="lg">
      {mockCourses.map((course) => (
        <Grid.Col span={{ base: 12, sm: 6, md: 4 }} key={course.id}>
          <Card style={styles.courseCard}>
            <Text size="lg" fw={500}>
              {course.name}
            </Text>
          </Card>
        </Grid.Col>
      ))}
    </Grid>
  );
}
