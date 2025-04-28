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
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [, setAnswers] = useState<Record<string, any>>({});
  const [duration, setDuration] = useState(10);
  const [timeLeft, setTimeLeft] = useState(10);
  const router = useRouter();

  const { screenStream, micStream, cameraStream } = useStreamContext();
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  const [timingMode, setTimingMode] = useState<'OVERALL' | 'PER_QUESTION'>('OVERALL');
  const [questionTimes, setQuestionTimes] = useState<number[]>([]); // e.g., [60, 90, 120]
  const [questionTimeLeft, setQuestionTimeLeft] = useState(0);

  const studentID = session?.user?.id;

  useEffect(() => {
    if (!examId) {return;}

    const fetchQuestions = async () => {
      const res = await fetch(`http://localhost:4000/exams/${examId}`);
      const data = await res.json();
      setTimingMode(data.timing_mode);
      const fetchedDuration = data.duration_minutes * 60; // Convert to seconds
      setDuration(fetchedDuration);
      setTimeLeft(fetchedDuration);

      const sorted = data.questions.sort(
        (a: any, b: any) => a.order_index - b.order_index
      );

      const times = sorted.map((q) => (Number(q.time_allocation) || 1));
      setQuestionTimes(times);
      setQuestionTimeLeft(times[0]);

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
  
    const interval = setInterval(() => {
      setTimeLeft((t) => t - 1);
  
      if (timingMode === 'PER_QUESTION') {
        setQuestionTimeLeft((qt) => {
          if (qt <= 1) {
            if (currentIndex === questions.length - 1) {
              clearInterval(interval);
              submitExam();
            } else {
              setCurrentIndex((i) => i + 1);
              return questionTimes[currentIndex + 1];
            }
          }
          return qt - 1;
        });
      }
  
    }, 1000);
  
    return () => clearInterval(interval);
  }, [timeLeft, timingMode, currentIndex, questionTimes, questions.length]);
  

  useEffect(() => {
    if (timingMode !== 'PER_QUESTION') {return;}
  
    setQuestionTimeLeft(questionTimes[currentIndex] * 60);
  
  }, [currentIndex, timingMode, questionTimes]);
  

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
  
      if (!mediaRecorder) {
        console.error('No recording available');
        return;
      }
  
      const recordedChunks: Blob[] = [];
  
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
  
      // FIRST: upload to /recordings
      const formDataRecording = new FormData();
      formDataRecording.append('file', recordingBlob, 'recording.webm');
  
      const recordingUploadRes = await fetch('http://localhost:4000/recordings', {
        method: 'POST',
        body: formDataRecording,
      });
  
      const recordingData = await recordingUploadRes.json();
      const recordingUrl = recordingData.url; // e.g., /recordings/uuid.webm
  
      // THEN: send file + metadata to /exam-submissions/upload
      const formDataSubmission = new FormData();
      formDataSubmission.append('file', recordingBlob, 'recording.webm');
      formDataSubmission.append('student_id', studentID);
      formDataSubmission.append('exam_id', examId);
      formDataSubmission.append('recording_url', recordingUrl);
  
      const uploadRes = await fetch('http://localhost:4000/exam-submissions/upload', {
        method: 'POST',
        body: formDataSubmission,
      });
  
      if (!uploadRes.ok) {
        const errorData = await uploadRes.json();
        console.error('Submission failed:', errorData);
        return;
      }
  
      console.log('Submission successful');
  
      screenStream?.getTracks().forEach((t) => t.stop());
      micStream?.getTracks().forEach((t) => t.stop());
      cameraStream?.getTracks().forEach((t) => t.stop());
  
      router.push('/dashboard');
    } catch (err) {
      console.error('Error during exam submission:', err);
    }
  };
  
  
  

  const currentQuestion = questions[currentIndex];

  const currentQuestionTime = questionTimes[currentIndex] * 60 || 1; // prevent divide-by-zero
  const questionRatio = questionTimeLeft / currentQuestionTime;

  const isRed =
  timingMode === 'OVERALL'
    ? timeLeft / duration < 0.2
    : questionRatio < 0.2;

  return (
    <Container size="md" py="lg">
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
          <Text span c={isRed ? 'red' : 'blue'}>
            {timingMode === 'OVERALL'
              ? formatTime(timeLeft)
              : formatTime(questionTimeLeft)}
          </Text>

          <Progress
            value={
              timingMode === 'OVERALL'
                ? (timeLeft / duration) * 100
                : (questionTimeLeft / currentQuestionTime) * 100
            }
            color={isRed ? 'red' : 'blue'}
          />
        </Title>

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
