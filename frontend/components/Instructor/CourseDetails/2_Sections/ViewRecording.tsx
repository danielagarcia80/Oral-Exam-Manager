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
import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}  

export default function ViewRecordingPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const courseId = searchParams.get('courseId');
    const submissionId = searchParams.get('submissionId');

    const [loading, setLoading] = useState(true);
    const [submission, setSubmission] = useState<any>(null);
    const [grade, setGrade] = useState('');
    const [feedback, setFeedback] = useState('');
    const videoRef = useRef<HTMLVideoElement>(null);
    const [showTranscript, setShowTranscript] = useState(false);


    useEffect(() => {
        const fetchSubmission = async () => {
            try {
                const res = await fetch(`http://localhost:4000/exam-submissions/${submissionId}`);
                const match = await res.json();

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
    }, [submissionId]);

    const handleSubmit = async () => {
        try {
            const res = await fetch(`http://localhost:4000/exam-submissions/${submissionId}/grade`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    grade_percentage: parseFloat(grade),
                    feedback,
                }),
            });

            if (res.ok) {
                router.push(`/instructor/grades-section?examId=${submission.exam_id}&courseId=${courseId}`);
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
                            ref={videoRef}
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
                        
                        {submission.transcriptSegments?.length > 0 && (
                            <>
                                <Button
                                variant="light"
                                onClick={() => setShowTranscript((prev) => !prev)}
                                mt="md"
                                >
                                {showTranscript ? 'Hide Full Transcript' : 'Show Full Transcript'}
                                </Button>

                                {showTranscript && (
                                <>
                                    <Title order={4} mt="md">Transcript</Title>
                                    <Stack gap="xs">
                                    {submission.transcriptSegments.map((segment: any, index: number) => (
                                        <Text key={index} size="sm">
                                        <Button
                                            variant="subtle"
                                            size="xs"
                                            onClick={() => {
                                            if (videoRef.current) {
                                                videoRef.current.currentTime = segment.start_seconds;
                                                videoRef.current.play();
                                            }
                                            }}
                                            style={{ marginRight: '8px' }}
                                        >
                                            [{formatTime(segment.start_seconds)}]
                                        </Button>
                                        {segment.text}
                                        </Text>
                                    ))}
                                    </Stack>
                                </>
                                )}
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
