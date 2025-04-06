import { Grid, Card, Text, TextInput, Stack } from '@mantine/core';
import { AddCourseCard } from './AddCourseCard';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useDashboardStyles } from '../Dashboard.styles';
import { useRouter } from 'next/navigation';

type Course = {
  course_id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  banner_url: string;
};

export function CourseCards({ isInstructor }: { isInstructor: boolean }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState('');

  const { classes } = useDashboardStyles();

  useEffect(() => {
    const fetchCourses = async () => {
      const userId = session?.user?.id;

      if (!userId) {return;}

      const endpoint = isInstructor
        ? `http://localhost:4000/courses/instructor/${userId}`
        : `http://localhost:4000/courses/student/${userId}`;

      const res = await fetch(endpoint);
      const data = await res.json();
      setCourses(data);
    };

    fetchCourses();
  }, [isInstructor, session?.user?.id]);

  // Filtered course list based on search term
  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Stack mb="lg">
      <TextInput
        placeholder="Search courses..."
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
        maw={300}
      />

      <Grid gutter="md">
        {filteredCourses.map((course) => (
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }} key={course.course_id}>
            <Card
              className={classes.courseCard}
              onClick={() => {
                const basePath = isInstructor
                  ? '/instructor/course-details'
                  : '/student/course-details';
                router.push(`${basePath}?courseId=${course.course_id}`);
              }}
            >
              <Card.Section>
                <img
                  src={`http://localhost:4000/${course.banner_url}`}
                  alt={`${course.title} banner`}
                  onError={(e) => {
                    e.currentTarget.src = '/default-banner.png';
                  }}
                  style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                />
              </Card.Section>
              <Text size="lg" fw={500}>
                {course.title}
              </Text>
              <Text size="xs" c="dimmed" mt="xs">
                {new Date(course.start_date).toLocaleDateString()} →{' '}
                {new Date(course.end_date).toLocaleDateString()}
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
    </Stack>
  );
}
