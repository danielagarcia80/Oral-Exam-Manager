// For some reason we have to click the checks twice in order for the video to show
// We need fix

'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button, Container, Stack, Text, Title, Card, Divider,Flex } from '@mantine/core';
import { IconCamera, IconMicrophone, IconScreenShare, IconClock } from '@tabler/icons-react';
import { CameraCheck } from './ComponentsTest/CameraCheck';
import { ScreenShareCheck } from './ComponentsTest/ScreenShare';
import { AudioCheck } from './ComponentsTest/AudioCheck';

type Exam = {
  exam_id: string;
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

    const [cameraOk, setCameraOk] = useState(false);
    const [audioOk, setAudioOk] = useState(false);
    const [screenOk, setScreenOk] = useState(false);

    const router = useRouter();
    
    useEffect(() => {
        const fetchExamAndCourse = async () => {
            if (!examId) return;

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

    const allChecksPassed = cameraOk && audioOk && screenOk;

    return (
        <Container size="lg" py="lg">
            <Stack gap="xs" mb="lg">
                <Title order={2}>{exam.title}</Title>
                <Text size="sm" c="dimmed">Course: {course.title}</Text>
                <Text size="sm" c="dimmed">{exam.description}</Text>
            </Stack>

            <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Title order={4} mb="md">Pre-exam Checklist</Title>
                <Divider mb="md" />

                <Stack gap="md">
                    <Stack gap="xs">
                        <Text fw={500}><IconCamera size={16} style={{ marginRight: 6 }} /> Camera Check</Text>
                        <CameraCheck onSuccess={() => setCameraOk(true)} />
                    </Stack>

                    <Stack gap="xs">
                        <Text fw={500}><IconMicrophone size={16} style={{ marginRight: 6 }} /> Microphone Check</Text>
                        <AudioCheck onSuccess={() => setAudioOk(true)} />
                    </Stack>

                    <Stack gap="xs">
                        <Text fw={500}><IconScreenShare size={16} style={{ marginRight: 6 }} /> Screen Share Check</Text>
                        <ScreenShareCheck onSuccess={() => setScreenOk(true)} />
                    </Stack>

                    <Stack gap="xs">
                        <Text fw={500}><IconClock size={16} style={{ marginRight: 6 }} /> Exam Timer</Text>
                        <Text size="sm">You will have {exam.duration ?? 'ERROR'} minutes once you begin.</Text>
                    </Stack>
                </Stack>

            </Card>

            <Flex justify="flex-end" mt="xl">
                <Button size="md" color="blue" disabled={!allChecksPassed}
                    onClick={() => router.push(`/student/taking-exam?examId=${exam.exam_id}`)
                    }
                >
                    Start Exam
                </Button>
            </Flex>
        </Container>
    );
}
