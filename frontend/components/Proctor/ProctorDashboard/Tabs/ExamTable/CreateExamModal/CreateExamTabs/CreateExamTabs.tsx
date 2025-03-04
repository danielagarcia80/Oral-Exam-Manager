import { Container, Tabs, rem } from '@mantine/core';
import { IconQuestionMark, IconArticle } from '@tabler/icons-react';
import ExamDetails from './ExamDetails/ExamDetails';
import QuestionDetails from './QuestionDetails/QuestionDetails';
import React, { useState } from 'react';
import { useInstructorDataContext } from '@/static/utils/InstructorDataContext/InstructorDataContext';

interface ModalContentProps {
  closeModal: () => void;  // Prop type declaration for the onClose function
  questions: Questions[];
}

interface Questions {
  question_id: number; // Ensure there is a unique identifier
  question_title: string;
  question_content: string;
  question_type: string;
}

const CreateExamTabs: React.FC<ModalContentProps> = ({ closeModal, questions }) => {
  const [examLinkedQuestions, setExamQuestions] = useState<Questions[]>([]);

  // Use the context to get the selected course ID
  const { selectedCourseId } = useInstructorDataContext();

  const handleExamSaved = async (examId: number) => {
    const questionIds = examLinkedQuestions.map(q => q.question_id);
    console.log("Linking questions to exams", examLinkedQuestions);
    try {
      const response = await fetch(`http://localhost:3001/exams/${examId}/questions`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ questionIds }), // Sending as an object with questionIds array
      });

      if (!response.ok) {
        throw new Error('Failed to update linked questions');
      }
      console.log('Linked questions updated successfully');
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
          <ExamDetails
            closeModal={closeModal}
            onExamSaved={(examId) => handleExamSaved(examId)}
          />
        </Tabs.Panel>
        <Tabs.Panel value="questions">
          <QuestionDetails
            updateExamQuestions={setExamQuestions}
            examLinkedQuestions={examLinkedQuestions}
            questions={questions}
          />
        </Tabs.Panel>
      </Tabs>
    </>
  );
}

export default CreateExamTabs;
