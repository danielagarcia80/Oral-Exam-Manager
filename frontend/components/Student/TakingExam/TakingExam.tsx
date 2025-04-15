'use client';

import {
  Button,
  Checkbox,
  Container,
  Group,
  Progress,
  Radio,
  Stack,
  Text,
  Textarea,
  Title,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStreamContext } from '@/components/Student/ExamSetup/StreamContext';
import { useSession } from 'next-auth/react';

type Question = {
  id: string;
  text: string;
  type: 'multiple_choice' | 'checkbox' | 'short_answer';
  options?: string[];
  images: {
    image_id: string;
    url: string;
    filename: string;
  }[];
};

export default function TakingExam() {
  const searchParams = useSearchParams();
  const examId = searchParams.get('examId');

  const { data: session } = useSession();
  
  const duration = Number(searchParams.get('duration') || 10);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [, setAnswers] = useState<Record<string, any>>({});
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const router = useRouter();

  const { screenStream, micStream, cameraStream } = useStreamContext();
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  //const [recordingChunks, setRecordingChunks] = useState<Blob[]>([]);


  const studentID = session?.user?.id;


  useEffect(() => {
    if (!examId) {return;}

    const fetchQuestions = async () => {
      const res = await fetch(`http://localhost:4000/exams/${examId}`);
      const data = await res.json();

      const sorted = data.questions.sort(
        (a: any, b: any) => a.order_index - b.order_index
      );

      setQuestions(
        sorted.map((q: any) => ({
          id: q.question.id,
          text: q.question.text,
          type: q.question.type,
          options: q.question.options,
          images: q.question.images?.map((imgObj: any) => ({
            image_id: imgObj.image.image_id,
            url: `http://localhost:4000${imgObj.image.image_data}`,
            filename: imgObj.image.original_filename,
          })) ?? [],
        }))
      );
    };

    fetchQuestions();
  }, [examId]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      submitExam();
      return;
    }

    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Start MediaRecorder
  useEffect(() => {
    if (!screenStream || !micStream) {return;}

    const videoTrack = screenStream.getVideoTracks()[0];
    const audioTrack = micStream.getAudioTracks()[0];

    if (!videoTrack || !audioTrack) {
      console.warn('Missing screen or mic track');
      return;
    }

    const combined = new MediaStream([videoTrack, audioTrack]);
    let recorder: MediaRecorder;

    try {
      recorder = new MediaRecorder(combined, { mimeType: 'video/webm' });
      recorder.start();
      setMediaRecorder(recorder);
      console.log('🎥 MediaRecorder started');
    } catch (err) {
      console.error('Error initializing MediaRecorder:', err);
    }

    return () => {
      recorder?.stop();
      combined.getTracks().forEach((t) => t.stop());
      console.log('🛑 MediaRecorder stopped');
    };
  }, [screenStream, micStream]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleAnswerChange = (val: any) => {
    const questionId = questions[currentIndex].id;
    setAnswers((prev) => ({ ...prev, [questionId]: val }));
  };

  const nextQuestion = () => {
    setCurrentIndex((i) => i + 1);
  };

  const submitExam = async () => {
    try {
      if (!studentID || !examId) {
        console.error('Missing student_id or examId');
        return;
      }
  
      let recordingUrl = '';
  
      if (mediaRecorder) {
        const recordedChunks: Blob[] = [];
  
        // Prepare to collect data
        const recordingBlob = await new Promise<Blob>((resolve) => {
          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              recordedChunks.push(event.data);
            }
          };
  
          mediaRecorder.onstop = () => {
            const finalBlob = new Blob(recordedChunks, { type: 'video/webm' });
            resolve(finalBlob);
          };
  
          mediaRecorder.stop();
        });
  
        const formData = new FormData();
        formData.append('file', recordingBlob, 'recording.webm');
  
        const uploadRes = await fetch('http://localhost:4000/recordings', {
          method: 'POST',
          body: formData,
        });
  
        const uploadData = await uploadRes.json();
        recordingUrl = uploadData.url;
      }
  
      const payload = {
        student_id: studentID,
        exam_id: examId,
        attempt_number: 1,
        recording_url: recordingUrl,
        duration_minutes: duration,
        grade_percentage: 0,
        feedback: '',
      };
  
      console.log('Payload:', payload);
  
      const res = await fetch('http://localhost:4000/exam-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        console.error('Submission failed:', errorData);
        return;
      }
  
      // Stop all media streams
      screenStream?.getTracks().forEach((t) => t.stop());
      micStream?.getTracks().forEach((t) => t.stop());
      cameraStream?.getTracks().forEach((t) => t.stop());
  
      router.push('/dashboard');
    } catch (err) {
      console.error('Error during exam submission:', err);
    }
  };
  

  const currentQuestion = questions[currentIndex];

  return (
    <Container size="md" py="lg">
      {/* Optional banner */}
      <Text
        c="red"
        ta="center"
        fw={700}
        mt="sm"
        style={{
          position: 'fixed',
          top: 0,
          width: '100%',
          backgroundColor: '#ffeaea',
          padding: '8px 0',
          zIndex: 999,
        }}
      >
        🔴 Recording in progress...
      </Text>

      {/* Camera preview */}
      {cameraStream && (
        <video
          autoPlay
          muted
          ref={(ref) => {
            if (ref && cameraStream && ref.srcObject !== cameraStream) {
              ref.srcObject = cameraStream;
            }
          }}
          style={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            width: 200,
            height: 150,
            borderRadius: 8,
            border: '2px solid #ccc',
            zIndex: 999,
            backgroundColor: '#000',
          }}
        />
      )}

      <Group gap="apart" mb="lg">
        <Title order={3}>
          Time Left:{' '}
          <Text span c={timeLeft <= 300 ? 'red' : 'blue'}>
            {formatTime(timeLeft)}
          </Text>
        </Title>
        <Progress
          value={(timeLeft / (duration * 60)) * 100}
          color={timeLeft <= 300 ? 'red' : 'blue'}
        />
      </Group>

      <Stack gap="md">
        <Title order={4}>Question {currentIndex + 1}</Title>

        {currentQuestion?.images?.length > 0 && (
          <Stack gap="xs">
            {currentQuestion.images.map((img) => (
              <img
                key={img.image_id}
                src={img.url}
                alt={img.filename}
                style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 8 }}
              />
            ))}
          </Stack>
        )}

        <Text>{currentQuestion?.text}</Text>

        {currentQuestion?.type === 'multiple_choice' && (
          <Radio.Group onChange={handleAnswerChange}>
            {currentQuestion.options?.map((opt, i) => (
              <Radio key={i} value={opt} label={opt} />
            ))}
          </Radio.Group>
        )}

        {currentQuestion?.type === 'checkbox' && (
          <Checkbox.Group onChange={handleAnswerChange}>
            {currentQuestion.options?.map((opt, i) => (
              <Checkbox key={i} value={opt} label={opt} />
            ))}
          </Checkbox.Group>
        )}

        {currentQuestion?.type === 'short_answer' && (
          <Textarea
            placeholder="Type your answer..."
            onChange={(e) => handleAnswerChange(e.currentTarget.value)}
          />
        )}

        <Group justify="flex-end" mt="lg">
          {currentIndex === questions.length - 1 ? (
            <Button onClick={submitExam}>Submit Exam</Button>
          ) : (
            <Button onClick={nextQuestion}>Next</Button>
          )}
        </Group>
      </Stack>
    </Container>
  );
}
