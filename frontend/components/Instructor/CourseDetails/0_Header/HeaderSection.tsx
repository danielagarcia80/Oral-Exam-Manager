'use client';

import { useEffect, useState } from 'react';
import { Card, Group, Stack, Text, Title, Skeleton, Box, Image } from '@mantine/core';
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
  banner_url: string;
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
      {/* Course Banner */}
      <Box
        mb="lg"
        style={{
          position: 'relative',
          width: '100%',
          paddingTop: '33.33%',
          overflow: 'hidden',
          borderRadius: '12px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
        }}
      >
        <Image
          src={`http://localhost:4000/${course.banner_url}`}
          alt="Course banner"
          fit="cover"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
          }}
        />
      </Box>
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
