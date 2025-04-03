import { Grid, Card, Text } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { AddCourseCard } from '../AddCourseCard';

export function CourseCards({ isInstructor }: { isInstructor: boolean }) {
  const router = useRouter();

  const handleCourseClick = (courseId: string) => {
    const base = isInstructor ? 'instructor' : 'student';
    router.push(`/${base}/courses/${courseId}`);
  };

  const mockCourses = [
    { id: '1', name: 'Intro to Comp Sci' },
    { id: '2', name: 'Algorithms & Data Structures' },
    { id: '3', name: 'Operating Systems' },
  ];

  return (
    <Grid gutter="md" mb="lg">
      {mockCourses.map((course) => (
        <Grid.Col span={{ base: 12, sm: 6, md: 4 }} key={course.id}>
          <Card
            withBorder
            shadow="sm"
            radius="md"
            onClick={() => handleCourseClick(course.id)}
            style={{ cursor: 'pointer' }}
          >
            <Text size="lg" fw={500}>
              {course.name}
            </Text>
          </Card>
        </Grid.Col>
      ))}

      {isInstructor && (
        <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
          <AddCourseCard />
        </Grid.Col>
      )}
    </Grid>
  );
}
