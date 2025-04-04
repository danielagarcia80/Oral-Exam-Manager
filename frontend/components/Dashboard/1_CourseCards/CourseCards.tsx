import { Grid, Card, Text } from '@mantine/core';
// import { useRouter } from 'next/navigation';
import { AddCourseCard } from './AddCourseCard';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useDashboardStyles } from '../Dashboard.styles';

type Course = {
  course_id: string;
  title: string;
  start_date: string;
  end_date: string;
}

export function CourseCards({ isInstructor }: { isInstructor: boolean }) {
  // const router = useRouter();
  const { data: session } = useSession();
  const [courses, setCourses] = useState<Course[]>([]);

  const styles = useDashboardStyles();

  useEffect(() => {
    const fetchCourses = async () => {
      const userId = session?.user?.id;
      
      if (!userId) {
        return;
      } 

      // Replace with your actual API endpoint once env setup is ready
      const endpoint = isInstructor
        ? `http://localhost:4000/courses/instructor/${userId}`
        : `http://localhost:4000/courses/student/${userId}`;

      const res = await fetch(endpoint);
      const data = await res.json();
      setCourses(data);
    };

    fetchCourses();
  }, [isInstructor, session?.user?.id]);

  return (
    <Grid gutter="md" mb="lg">
      {courses.map((course) => (
        <Grid.Col span={{ base: 12, sm: 6, md: 4 }} key={course.course_id}>
          <Card style={styles.courseCard}>
            <Text size="lg" fw={500}>
              {course.title}
            </Text>
            <Text size="xs" c="dimmed" mt="xs">
              {new Date(course.start_date).toLocaleDateString()} → {new Date(course.end_date).toLocaleDateString()}
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
