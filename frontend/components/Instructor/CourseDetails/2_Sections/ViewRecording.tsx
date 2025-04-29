'use client';

import {
    Title,
    Text,
    Stack,
    TextInput,
    Textarea,
    Button,
    Container,
    Group,
    Loader,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function ViewRecordingPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const examId = searchParams.get('examId');
    const studentId = searchParams.get('studentId');
    const courseId = searchParams.get('courseId');

    const [loading, setLoading] = useState(true);
    const [submission, setSubmission] = useState<any>(null);
    const [grade, setGrade] = useState('');
    const [feedback, setFeedback] = useState('');

    useEffect(() => {
        const fetchSubmission = async () => {
            if (!examId || !studentId) {return;}

            try {
                const res = await fetch(`http://localhost:4000/exam-submissions/exam/${examId}`);
                const data = await res.json();
                const match = data.find((s: any) => s.student_id === studentId);

                if (!match) {throw new Error('Submission not found');}

                setSubmission(match);
                setGrade(match.grade_percentage?.toString() || '');
                setFeedback(match.feedback || '');
            } catch (err) {
                console.error('Error loading submission:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchSubmission();
    }, [examId, studentId]);

    const handleSubmit = async () => {
        try {
            const res = await fetch('http://localhost:4000/exam-submissions/grade', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    student_id: studentId,
                    exam_id: examId,
                    grade_percentage: parseFloat(grade),
                    feedback,
                }),
            });

            if (res.ok) {
                router.push(`/instructor/grades-section?examId=${examId}&courseId=${courseId}`);
            } else {
                const error = await res.json();
                console.error('Grade submission failed:', error);
            }
        } catch (err) {
            console.error('Failed to submit grade:', err);
        }
    };

    if (loading) {
        return (
            <Group justify="center" mt="xl">
                <Loader />
            </Group>
        );
    }

    return (
        <Container size="sm" py="xl">
            <Stack>
                <Title order={3}>Review Recording & Grade</Title>

                {submission && (
                    <>
                        <Text>Name: {submission.student?.first_name} {submission.student?.last_name}</Text>
                        <Text>Email: {submission.student?.email}</Text>

                        <video
                            controls
                            src={`http://localhost:4000${submission.recording_url}`}
                            style={{ width: '100%', borderRadius: '8px', border: '1px solid #ccc' }}
                        >
                            <track
                                kind="captions"
                                src={`http://localhost:4000${submission.captions_url}`}
                                srcLang="en"
                                label="English"
                                default
                            />
                        </video>
                        
                        {submission.transcript && (
                          <>
                            <Title order={4}>Transcript</Title>
                            <Text>{submission.transcript}</Text>
                          </>
                        )}

                        {submission.summary && (
                        <>
                            <Title order={4}>Summary</Title>
                            <Text>{submission.summary}</Text>
                        </>
                        )}


                        <TextInput
                            label="Grade (%)"
                            type="number"
                            value={grade}
                            onChange={(e) => setGrade(e.currentTarget.value)}
                            required
                        />

                        <Textarea
                            label="Feedback"
                            value={feedback}
                            onChange={(e) => setFeedback(e.currentTarget.value)}
                            autosize
                            minRows={3}
                        />

                        <Button onClick={handleSubmit}>Submit Grade</Button>
                    </>
                )}
            </Stack>
        </Container>
    );
}
