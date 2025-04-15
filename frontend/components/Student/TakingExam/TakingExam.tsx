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
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type Question = {
  id: string;
  text: string;
  type: 'multiple_choice' | 'checkbox' | 'short_answer';
  options?: string[];
};

type Answer = {
  question_id: string;
  answer: string | string[];
};

export default function TakingExam() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const examId = searchParams.get('examId');
  const { data: session } = useSession();
  const student_id = session?.user?.id;


  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [duration, setDuration] = useState<number>(1);
  const [timeLeft, setTimeLeft] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    const blockEvent = (e: Event) => e.preventDefault();
    document.addEventListener('contextmenu', blockEvent);
    document.addEventListener('copy', blockEvent);
    document.addEventListener('cut', blockEvent);
    document.addEventListener('paste', blockEvent);
    return () => {
      document.removeEventListener('contextmenu', blockEvent);
      document.removeEventListener('copy', blockEvent);
      document.removeEventListener('cut', blockEvent);
      document.removeEventListener('paste', blockEvent);
    };
  }, []);

  useEffect(() => {
    if (!examId) return;

    const fetchExam = async () => {
      try {
        const res = await fetch(`http://localhost:4000/exams/${examId}`);
        const data = await res.json();
        const sorted = data.questions.sort((a: any, b: any) => a.order_index - b.order_index);

        setQuestions(
          sorted.map((q: any) => ({
            id: q.question.id,
            text: q.question.text,
            type: q.question.type,
            options: q.question.options,
          }))
        );
        setDuration(data.duration_minutes);
        console.log(data.duration_minutes)
        console.log(duration)
        setTimeLeft(data.duration_minutes * 60);
        console.log(timeLeft)
        setLoading(false);
      } catch (err) {
        console.error('Failed to load exam:', err);
      }
    };

    fetchExam();
  }, [examId]);

  useEffect(() => {
    if (timeLeft <= 0) {
      submitExam();
      return;
    }

    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswerChange = (value: string | string[]) => {
    setAnswers((prev) => {
      const updated = [...prev];
      const index = updated.findIndex((a) => a.question_id === currentQuestion.id);
      if (index >= 0) {
        updated[index].answer = value;
      } else {
        updated.push({ question_id: currentQuestion.id, answer: value });
      }
      return updated;
    });
  };

  const nextQuestion = () => setCurrentIndex((prev) => prev + 1);

  const submitExam = async () => {
    try {
      const payload = {
        student_id: student_id,       
        exam_id: examId,
        attempt_number: 1,
        recording_url: '',                  
        duration_minutes: duration,
        grade_percentage: 0,
        feedback: '',
      };

      console.log('Submitting payload:', payload);

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

      router.push('/dashboard');
    } catch (err) {
      console.error('Network error during submission:', err);
    }
  };


  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    console.log('Duration updated:', duration);
  }, [duration]);

  useEffect(() => {
    console.log('Time left updated:', timeLeft);
  }, [timeLeft]);


  if (loading || !currentQuestion) return <Text>Loading exam...</Text>;


  return (

    <Container size="md" py="lg">
      <Group position="apart" mb="lg">
        <Title order={3}>
          Time Left:{' '}
          <Text span c={timeLeft <= 300 ? 'red' : 'blue'}>
            {formatTime(timeLeft)}
          </Text>
        </Title>
        <Progress value={(timeLeft / (duration * 60)) * 100} color={timeLeft <= 300 ? 'red' : 'blue'} />
      </Group>

      <Stack spacing="md">
        <Title order={4}>Question {currentIndex + 1}</Title>
        <Text>{currentQuestion.text}</Text>

        {currentQuestion.type === 'multiple_choice' && (
          <Radio.Group onChange={handleAnswerChange}>
            {currentQuestion.options?.map((opt, i) => (
              <Radio key={i} value={opt} label={opt} />
            ))}
          </Radio.Group>
        )}

        {currentQuestion.type === 'checkbox' && (
          <Checkbox.Group onChange={handleAnswerChange}>
            {currentQuestion.options?.map((opt, i) => (
              <Checkbox key={i} value={opt} label={opt} />
            ))}
          </Checkbox.Group>
        )}

        {currentQuestion.type === 'short_answer' && (
          <Textarea
            placeholder="Type your answer..."
            onChange={(e) => handleAnswerChange(e.currentTarget.value)}
          />
        )}

        <Group position="right" mt="lg">
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
