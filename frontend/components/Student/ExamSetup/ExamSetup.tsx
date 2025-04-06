'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button, Center, Container, Flex, Stack, Text, Title } from '@mantine/core';
import { CameraCheck } from './CameraCheck';
import { ScreenShareCheck } from './ScreenShare';
import { AudioCheck } from './AudioCheck';

type Exam = {
    id: string;
    title: string;
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
            if (!examId) return;

            try {
                // Fetch exam
                const examRes = await fetch(`http://localhost:4000/exams/${examId}`);
                const examData = await examRes.json();
                setExam(examData);

                // Fetch course using exam.course_id
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
        <Container size="lg" pt="md">
            <Title order={3}>{course.title} &gt; {exam.title}</Title>

            <Center mt="xl">
                <Stack align="center" spacing="sm">
                    <CameraCheck />
                    <ScreenShareCheck />
                    <AudioCheck />
                 
                    <Text>Checklist item: Code upload</Text>
                </Stack>

                

            </Center>

            <Flex justify="space-between" mt="xl">
                <div />
                <Button size="md">Start Exam</Button>
                <Text size="sm" c="dimmed">
                    Time Limit: {exam.duration} min
                </Text>
            </Flex>
        </Container>
    );
}
