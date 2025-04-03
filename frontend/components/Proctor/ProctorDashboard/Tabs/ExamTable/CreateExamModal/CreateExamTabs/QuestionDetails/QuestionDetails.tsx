// ____________________________________________________________________________________________________________

import { useState } from 'react';
import { Button, Divider } from '@mantine/core';
import AddQuestionsModal from './AddQuestionsModal/AddQuestionsModal';
import { QuestionsOrder } from './QuestionsOrder/QuestionsOrder';

interface Props {
  questions: Questions[];
  examLinkedQuestions: Questions[];
  updateExamQuestions: (newQuestions: Questions[]) => void;
}

interface Questions {
  question_id: number; // Ensure there is a unique identifier
  question_title: string;
  question_content: string;
  question_type: string;
}

// ____________________________________________________________________________________________________________

export default function QuestionDetails({ questions, updateExamQuestions }: Props) {
  const [ExamQuestions, setExamQuestions] = useState<Questions[]>([]);

  return (
    <>
      <div style={{ marginTop: '2%' }}></div>
      <QuestionsOrder examQuestions={ExamQuestions} />
      <div style={{ paddingTop: '30px', marginBottom: '2%' }}>
        <Divider />
      </div>

      <AddQuestionsModal
        questions={questions}
        examLinkedQuestions={ExamQuestions}
        setExamQuestions={setExamQuestions}
        updateExamQuestions={updateExamQuestions}
      />
    </>
  );
}
