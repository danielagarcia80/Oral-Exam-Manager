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

  const [timingMode, setTimingMode] = useState<'OVERALL' | 'PER_QUESTION'>('OVERALL');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [requiresAudio, setRequiresAudio] = useState(false);
  const [requiresVideo, setRequiresVideo] = useState(false);
  const [requiresScreenShare, setRequiresScreenShare] = useState(false);
  const [questionTimeMap, setQuestionTimeMap] = useState<Record<string, number>>({});
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [allowedAttempts, setAllowedAttempts] = useState(1);



  // Question selection state
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [questionKeywordsMap, setQuestionKeywordsMap] = useState<Record<string, string[]>>({});


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
        setTimingMode(data.duration_mode || 'OVERALL');
        setDurationMinutes(data.duration_minutes || 30);
        setRequiresAudio(data.requires_audio);
        setRequiresVideo(data.requires_video);
        setRequiresScreenShare(data.requires_screen_share);
        setAllowedAttempts(data.allowed_attempts);

        // Fetch students who are assigned to this exam
        const assignedRes = await fetch(`http://localhost:4000/exams/${examId}/assigned-students`);
        const assignedData = await assignedRes.json();
        setSelectedStudentIds(assignedData.map((a: any) => a.student.user_id));

        // Build time allocation map
        const qtMap: Record<string, number> = {};
        data.questions.forEach((entry: any) => {
          const qid = entry.question?.question_id ?? entry.question_id;
          if (entry.time_allocation) {
            qtMap[qid] = entry.time_allocation;
          }
        });
        setQuestionTimeMap(qtMap);


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
    if (!title || !examType || !startDate || !endDate || !examId) {
      notifications.show({
        title: 'Form Incomplete',
        message: 'Please fill in all required fields and select at least one question.',
        color: 'red',
      });
      return;
    }

    try {
      
      let computedDuration = durationMinutes;

      if (timingMode === 'PER_QUESTION') {
        computedDuration = Object.values(questionTimeMap).reduce((sum, t) => sum + (t || 1), 0);
      }


      
      await fetch(`http://localhost:4000/exams/${examId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          type: examType,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          timing_mode: timingMode,
          duration_minutes: timingMode === 'OVERALL' ? durationMinutes : computedDuration,
          requires_audio: requiresAudio,
          requires_video: requiresVideo,
          requires_screen_share: requiresScreenShare,
          allowed_attempts: allowedAttempts,
        }),
      });
      

      // Replace questions (delete all, then add selected)
      await fetch(`http://localhost:4000/exam-question-links/${examId}`, {
        method: 'DELETE',
      });


      for (let index = 0; index < selectedQuestions.length; index++) {
        const question_id = selectedQuestions[index];
      
        const payload: any = {
          exam_id: examId,
          question_id,
          order_index: index,
        };
      
        if (timingMode === 'PER_QUESTION') {
          payload.time_allocation = questionTimeMap[question_id] ?? 1;
        }
      
        await fetch('http://localhost:4000/exam-question-links', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      
      await fetch(`http://localhost:4000/exams/${examId}/assigned-students`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studentIds: selectedStudentIds }),
      });

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
          timingMode={timingMode}
          setTimingMode={setTimingMode}
          durationMinutes={durationMinutes}
          setDurationMinutes={setDurationMinutes}
          requiresAudio={requiresAudio}
          setRequiresAudio={setRequiresAudio}
          requiresVideo={requiresVideo}
          setRequiresVideo={setRequiresVideo}
          requiresScreenShare={requiresScreenShare}
          setRequiresScreenShare={setRequiresScreenShare}
          courseId={courseId}
          selectedStudentIds={selectedStudentIds}
          setSelectedStudentIds={setSelectedStudentIds}
          allowedAttempts={allowedAttempts}
          setAllowedAttempts={setAllowedAttempts}
        />



        <QuestionSelection
          selectedQuestions={selectedQuestions}
          setSelectedQuestions={setSelectedQuestions}
          timingMode={timingMode}
          questionTimeMap={questionTimeMap}
          setQuestionTimeMap={setQuestionTimeMap}
          questionKeywordsMap={questionKeywordsMap}
          setQuestionKeywordsMap={setQuestionKeywordsMap}
        />




        <Button mt="md" onClick={handleSubmit}>
          Save Changes
        </Button>
      </Stack>
    </Container>
  );
}
