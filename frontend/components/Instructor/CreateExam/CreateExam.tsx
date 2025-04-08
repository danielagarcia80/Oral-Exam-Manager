'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Container, Stack } from '@mantine/core';
import { ExamDetails } from './ExamDetails/ExamDetails';
import { QuestionSelection } from './QuestionSelection/QuestionSelection';
import { notifications } from '@mantine/notifications';

export default function CreateExam() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get('courseId');

  // Exam form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [examType, setExamType] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [durationMinutes, setDurationMinutes] = useState(30);
  const [timingMode, setTimingMode] = useState('OVERALL');
  const [requiresAudio, setRequiresAudio] = useState(true);
  const [requiresVideo, setRequiresVideo] = useState(true);
  const [requiresScreenShare, setRequiresScreenShare] = useState(true);


  // Question selection state
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);

  const handleSubmit = async () => {
    if (!title || !examType || !startDate || !endDate || !courseId) {
      notifications.show({
        title: 'Form Incomplete',
        message: 'Please fill in all required fields and select at least one question.',
        color: 'red',
      });
      return;
    }

    try {
      const res = await fetch('http://localhost:4000/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          body: JSON.stringify({
            title,
            description,
            type: examType,
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
            course_id: courseId,
            duration_minutes: durationMinutes,
            timing_mode: timingMode,
            requires_audio: requiresAudio,
            requires_video: requiresVideo,
            requires_screen_share: requiresScreenShare,
          }),
          
        }),
      });

      const data = await res.json();
      const examId = data.exam_id;

      for (let index = 0; index < selectedQuestions.length; index++) {
        const question_id = selectedQuestions[index];
      
        await fetch('http://localhost:4000/exam-question-links', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            exam_id: examId,
            question_id,
            order_index: index,
          }),
        });
      }

      router.push(`/instructor/course-details?courseId=${courseId}`);
    } catch (err) {
      console.error('[CreateExam] Failed to submit:', err);
    }
  };

  return (
    <Container pt="md">
      <Stack>
      <ExamDetails
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          examType={examType}
          setExamType={setExamType}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}

          durationMinutes={durationMinutes}
          setDurationMinutes={setDurationMinutes}
          timingMode={timingMode}
          setTimingMode={setTimingMode}
          requiresAudio={requiresAudio}
          setRequiresAudio={setRequiresAudio}
          requiresVideo={requiresVideo}
          setRequiresVideo={setRequiresVideo}
          requiresScreenShare={requiresScreenShare}
          setRequiresScreenShare={setRequiresScreenShare}
        />


        <QuestionSelection
          selectedQuestions={selectedQuestions}
          setSelectedQuestions={setSelectedQuestions}
        />

        <Button mt="md" onClick={handleSubmit}>
          Create Exam
        </Button>
      </Stack>
    </Container>
  );
}
