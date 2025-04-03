import React, { useEffect, useState } from 'react';
import { IconArticle, IconQuestionMark, IconUsers } from '@tabler/icons-react';
import { Button, Container, Flex, rem, Tabs } from '@mantine/core';
import ExamDetails from '../CreateExamModal/CreateExamTabs/ExamDetails/ExamDetails';
import QuestionDetails from '../CreateExamModal/CreateExamTabs/QuestionDetails/QuestionDetails';
import EditExam from './EditExam/EditExam';
import EditQuestionDetails from './EditExamQuestions/EditQuestionDetails';

interface ModalContentProps {
  closeModal: () => void;
  questions: Questions[];
  currentExam?: ExamData;
}

interface ExamData {
  exam_id: number;
  exam_title: string;
  exam_instructions: string;
  available_from: string;
  available_to: string;
  access_code: string;
}

interface Questions {
  question_id: number;
  question_title: string;
  question_content: string;
  question_type: string;
}

const EditExamTabs: React.FC<ModalContentProps> = ({ closeModal, questions, currentExam }) => {
  const [examLinkedQuestions, setExamQuestions] = useState<Questions[]>([]);

  useEffect(() => {
    const fetchExamLinkedQuestions = async () => {
      if (currentExam && currentExam.exam_id) {
        try {
          const response = await fetch(
            `http://localhost:3001/exams/${currentExam.exam_id}/linked-questions`
          );
          if (!response.ok) throw new Error('Failed to fetch linked questions');
          const data = await response.json();
          setExamQuestions(data);
        } catch (error) {
          console.error('Fetch error:', error);
        }
      }
    };

    fetchExamLinkedQuestions();
  }, [currentExam]);

  const handleExamSaved = async (examId: number) => {
    const questionIds = examLinkedQuestions.map((q) => q.question_id);

    try {
      const response = await fetch(`http://localhost:3001/exams/${examId}/questions`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ questionIds }),
      });

      if (!response.ok) throw new Error('Failed to update linked questions');
      window.location.reload();
    } catch (error) {
      console.error('Error updating linked questions:', error);
    }
  };

  const iconStyle = { width: rem(12), height: rem(12) };
  return (
    <>
      <Tabs variant="outline" radius="md" defaultValue="exam-details">
        <Tabs.List grow justify="center">
          <Tabs.Tab value="exam-details" leftSection={<IconArticle style={iconStyle} />}>
            Exam Details
          </Tabs.Tab>
          <Tabs.Tab value="questions" leftSection={<IconQuestionMark style={iconStyle} />}>
            Question Details
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="exam-details">
          <EditExam onExamSaved={(examId) => handleExamSaved(examId)} examData={currentExam} />
        </Tabs.Panel>
        <Tabs.Panel value="questions">
          <EditQuestionDetails
            updateExamQuestions={setExamQuestions}
            examLinkedQuestions={examLinkedQuestions}
            questions={questions}
          />
        </Tabs.Panel>
      </Tabs>
    </>
  );
};

export default EditExamTabs;
