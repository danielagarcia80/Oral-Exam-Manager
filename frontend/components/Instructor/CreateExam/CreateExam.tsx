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
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [manualAssign, setManualAssign] = useState(false);
  const [allowedAttempts, setAllowedAttempts] = useState(1);


  // Question selection state
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [questionTimeMap, setQuestionTimeMap] = useState<Record<string, number>>({});


  const handleSubmit = async () => {
    if (!title || !examType || !startDate || !endDate || !courseId) {
      notifications.show({
        title: 'Form Incomplete',
        message: 'Please fill in all required fields and select at least one question.',
        color: 'red',
      });
      return;
    }
  
    // 1. Create the exam
    const res = await fetch('http://localhost:4000/exams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
        allowed_attempts: allowedAttempts,
      }),
    });
  
    const data = await res.json();
    const examId = data.exam_id;
  
    // 2. Link questions to the exam
    for (let index = 0; index < selectedQuestions.length; index++) {
      const question_id = selectedQuestions[index];
  
      const payload: any = {
        exam_id: examId,
        question_id,
        order_index: index,
      };
  
      if (timingMode === 'PER_QUESTION') {
        payload.time_allocation = questionTimeMap[question_id] ?? 1; // Default to 1 min if missing
      }
  
      await fetch('http://localhost:4000/exam-question-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }
  
    // 3. Adjust total duration if timing is per-question
    if (timingMode === 'PER_QUESTION') {
      const total = Object.values(questionTimeMap).reduce((sum, t) => sum + t, 0);
  
      await fetch(`http://localhost:4000/exams/${examId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ duration_minutes: total }),
      });
    }
  
    // 4. Assign students if manual assign is enabled
   
    await fetch(`http://localhost:4000/exams/${examId}/assigned-students`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        studentIds: manualAssign ? selectedStudentIds : undefined,
      }),
    });

    // 5. Redirect
    router.push(`/instructor/course-details?courseId=${courseId}`);
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
          selectedStudentIds={selectedStudentIds}
          setSelectedStudentIds={setSelectedStudentIds}
          courseId={courseId}
          manualAssign={manualAssign}
          setManualAssign={setManualAssign}
          allowedAttempts={allowedAttempts}
          setAllowedAttempts={setAllowedAttempts}
        />


        <QuestionSelection
          selectedQuestions={selectedQuestions}
          setSelectedQuestions={setSelectedQuestions}
          timingMode={timingMode}
          questionTimeMap={questionTimeMap}
          setQuestionTimeMap={setQuestionTimeMap}
        />

        <Button mt="md" onClick={handleSubmit}>
          Create Exam
        </Button>
      </Stack>
    </Container>
  );
}
