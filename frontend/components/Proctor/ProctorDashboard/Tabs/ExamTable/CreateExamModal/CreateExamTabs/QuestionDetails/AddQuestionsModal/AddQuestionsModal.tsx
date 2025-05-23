// ____________________________________________________________________________________________________________

import { useEffect, useState } from 'react';
import { IconQuestionMark } from '@tabler/icons-react';
import { Button, Modal, Text } from '@mantine/core';
import QuestionSelector from './QuestionSelector/QuestionSelector';

interface Questions {
  question_id: number; // Ensure there is a unique identifier
  question_title: string;
  question_content: string;
  question_type: string;
}

interface Props {
  questions: Questions[];
  examLinkedQuestions: Questions[];
  updateExamQuestions: (newQuestions: Questions[]) => void;
  setExamQuestions: (newQuestions: Questions[]) => void;
}

// ____________________________________________________________________________________________________________

export default function AddQuestionsModal({
  questions,
  examLinkedQuestions,
  setExamQuestions,
  updateExamQuestions,
}: Props) {
  const [opened, setOpened] = useState(false);
  const openModal = () => setOpened(true);
  const closeModal = () => setOpened(false);

  return (
    <>
      <Modal opened={opened} onClose={closeModal} size="60%">
        <QuestionSelector
          closeModal={closeModal}
          examQuestions={examLinkedQuestions}
          questions={questions}
          onClose={closeModal}
          setExamQuestions={setExamQuestions}
          updateExamQuestions={updateExamQuestions}
        />
      </Modal>
      <Button size="xl" onClick={openModal} variant="default">
        <IconQuestionMark />
        Add Questions
      </Button>
    </>
  );
}
