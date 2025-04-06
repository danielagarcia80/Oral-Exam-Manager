'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ExamDetails } from './ExamDetails/ExamDetails';
import { QuestionSelection } from './QuestionSelection/QuestionSelection';
import { Button, Container, Loader, Stack } from '@mantine/core';
import { notifications } from '@mantine/notifications';

export default function EditExam() {
  const searchParams = useSearchParams();
  const examId = searchParams.get('examId');
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [courseId, setCourseId] = useState<string | null>(null);

  // Exam state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [examType, setExamType] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Question selection state
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);

  useEffect(() => {
    const fetchExam = async () => {
      if (!examId) {return;}

      try {
        const res = await fetch(`http://localhost:4000/exams/${examId}`);
        const data = await res.json();

        setTitle(data.title);
        setDescription(data.description);
        setExamType(data.type);
        setStartDate(new Date(data.start_date));
        setEndDate(new Date(data.end_date));
        setCourseId(data.course_id);

        // Handle shape: [{ question: { question_id }, ... }]
        const questionIds = data.questions.map((entry: any) =>
          entry.question?.question_id ?? entry.question_id
        );
        setSelectedQuestions(questionIds);

        setLoading(false);
      } catch (err) {
        console.error('[EditExam] Failed to fetch exam:', err);
      }
    };

    fetchExam();
  }, [examId]);

  const handleSubmit = async () => {
    if (!title || !examType || !startDate || !endDate || !examId || selectedQuestions.length === 0) {
      notifications.show({
        title: 'Form Incomplete',
        message: 'Please fill in all required fields and select at least one question.',
        color: 'red',
      });
      return;
    }

    try {
      // Update exam metadata
      await fetch(`http://localhost:4000/exams/${examId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          type: examType,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
        }),
      });

      // Replace questions (delete all, then add selected)
      await fetch(`http://localhost:4000/exam-question-links/${examId}`, {
        method: 'DELETE',
      });

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
      

      notifications.show({
        title: 'Success',
        message: 'Exam updated successfully.',
        color: 'green',
      });

      router.push(`/instructor/course-details?courseId=${courseId}`);
    } catch (err) {
      console.error('[EditExam] Failed to update exam:', err);
      notifications.show({
        title: 'Error',
        message: 'Something went wrong while updating the exam.',
        color: 'red',
      });
    }
  };

  if (loading) {return <Loader />;}

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
        />

        <QuestionSelection
          selectedQuestions={selectedQuestions}
          setSelectedQuestions={setSelectedQuestions}
        />

        <Button mt="md" onClick={handleSubmit}>
          Save Changes
        </Button>
      </Stack>
    </Container>
  );
}
