'use client';

import { useEffect, useState } from 'react';
import { Card, Group, Stack, Text, Title, Skeleton } from '@mantine/core';
import { useStyles } from '../CourseDetails.styles';

interface HeaderSectionProps {
  courseId: string;
}

interface CourseData {
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  instructors: string[];
  numStudents: number;
}

export function HeaderSection({ courseId }: HeaderSectionProps) {
  const [course, setCourse] = useState<CourseData | null>(null);

  const { classes } = useStyles();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`http://localhost:4000/courses/${courseId}/details`);
        const data = await res.json();
        setCourse(data);
      } catch (err) {
        console.error('Failed to fetch course details:', err);
      }
    };

    fetchCourse();
  }, [courseId]);

  if (!course) {
    return <Skeleton height={100} radius="md" />;
  }

  return (
    <Card className={classes.tableWrapper} radius="md" mb="md" shadow="sm">
      <Stack gap="xs">
        <Group justify="space-between">
          <Title order={3}>{course.title}</Title>
          <Text size="sm" c="dimmed">
            {new Date(course.start_date).toLocaleDateString()} →{' '}
            {new Date(course.end_date).toLocaleDateString()}
          </Text>
        </Group>

        {course.description && <Text>{course.description}</Text>}

        <Group>
          <Text size="sm">
            👩‍🏫 Instructors: {course.instructors.join(', ')}
          </Text>
          <Text size="sm">👥 Students: {course.numStudents}</Text>
        </Group>
      </Stack>
    </Card>

  );
}
