// For some reason we have to click the checks twice in order for the video to show
// We need fix

'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Button,
  Container,
  Stack,
  Text,
  Title,
  Card,
  Divider,
  Group,
  Badge,
  Flex,
  Box,
} from '@mantine/core';
import { IconCamera, IconMicrophone, IconScreenShare, IconClock } from '@tabler/icons-react';
import { CameraCheck } from './ComponentsTest/CameraCheck';
import { ScreenShareCheck } from './ComponentsTest/ScreenShare';
import { AudioCheck } from './ComponentsTest/AudioCheck';

type Exam = {
  id: string;
  title: string;
  description: string;
  duration: number;
  course_id: string;
};

type Course = {
  id: string;
  title: string;
};

export default function ExamSetup() {
  const searchParams = useSearchParams();
  const examId = searchParams.get('examId');

  const [exam, setExam] = useState<Exam | null>(null);
  const [course, setCourse] = useState<Course | null>(null);

  useEffect(() => {
    const fetchExamAndCourse = async () => {
      if (!examId) {return;}

      try {
        const examRes = await fetch(`http://localhost:4000/exams/${examId}`);
        const examData = await examRes.json();
        setExam(examData);

        const courseRes = await fetch(`http://localhost:4000/courses/${examData.course_id}`);
        const courseData = await courseRes.json();
        setCourse(courseData);
      } catch (err) {
        console.error('Failed to load exam or course:', err);
      }
    };

    fetchExamAndCourse();
  }, [examId]);

  if (!exam || !course) {return <Text>Loading exam setup...</Text>;}

  return (
    <Container size="lg" py="lg">
      <Stack gap="xs" mb="lg">
        <Title order={2}>{exam.title}</Title>
        <Text size="sm" c="dimmed">
          Course: {course.title}
        </Text>
        <Text size="sm" c="dimmed">
          {exam.description}
        </Text>
      </Stack>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Title order={4} mb="md">
          Pre-exam Checklist
        </Title>
        <Divider mb="md" />

        <Stack gap="md">
          <ChecklistItem icon={<IconCamera size={18} />} label="Camera Check">
            <CameraCheck />
          </ChecklistItem>

          <ChecklistItem icon={<IconMicrophone size={18} />} label="Microphone Check">
            <AudioCheck />
          </ChecklistItem>

          <ChecklistItem icon={<IconScreenShare size={18} />} label="Screen Share Check">
            <ScreenShareCheck />
          </ChecklistItem>

          <ChecklistItem icon={<IconClock size={18} />} label="Exam Timer">
            <Text size="sm">You will have {exam.duration ? exam.duration : "ERROR"} minutes once you begin.</Text>
          </ChecklistItem>
        </Stack>
      </Card>

      <Flex justify="flex-end" mt="xl">
        <Button size="md" color="blue">
          Start Exam
        </Button>
      </Flex>
    </Container>
  );
}

function ChecklistItem({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Flex align="flex-start" gap="md">
      <Box w={200}>
        <Badge variant="light" color="gray" leftSection={icon} fullWidth>
          {label}
        </Badge>
      </Box>

      <Box style={{ flex: 1 }}>
        {children}
      </Box>
    </Flex>
  );
}


