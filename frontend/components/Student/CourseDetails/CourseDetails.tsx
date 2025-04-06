'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Card, Container, Flex, Stack, Text, Title } from '@mantine/core';

type Exam = {
  exam_id: string;
  title: string;
};

type Course = {
  id: string;
  title: string;
  scores: number;
  // no exams here!
};

export function CourseDetails() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get('courseId');

  const [course, setCourse] = useState<Course | null>(null);
  const [exams, setExams] = useState<Exam[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) return;

      try {
        const res = await fetch(`http://localhost:4000/courses/${courseId}`);
        if (!res.ok) {
          console.error('Failed to fetch course:', res.statusText);
          return;
        }
        const data = await res.json();
        setCourse(data);
      } catch (err) {
        console.error('Error fetching course:', err);
      }
    };

    const fetchExams = async () => {
      if (!courseId) return;

      try {
        const res = await fetch(`http://localhost:4000/exams/course/${courseId}`);
        if (!res.ok) {
          console.error('Failed to fetch exams:', res.statusText);
          return;
        }
        const data = await res.json();
        setExams(data);
      } catch (err) {
        console.error('Error fetching exams:', err);
      }
    };

    fetchCourse();
    fetchExams();
  }, [courseId]);

  if (!course) {return <Text>Loading course...</Text>;}

  return (
    <Container>
      <Title order={2}>{course.title}</Title>
      <Text>Scores: {course.scores}</Text>

      <Card mt="xl" shadow="sm" p="lg" radius="md" withBorder>
        <Title order={3} mb="md">List of Exams</Title>
        <Stack>
          {exams.length > 0 ? (
            exams.map((exam) => (
              <Flex
                key={exam.exam_id}
                justify="space-between"
                align="center"
                style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12 }}
              >
                <Text>{exam.title}</Text>
                <Button onClick={() => router.push(`/student/exam-setup?examId=${exam.exam_id}`)}>
                  Start
                </Button>

              </Flex>
            ))
          ) : (
            <Text>No exams found.</Text>
          )}
        </Stack>
      </Card>
    </Container>
  );
}


