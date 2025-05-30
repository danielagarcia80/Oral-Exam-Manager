import React, { useState } from 'react';
import { IconPlus } from '@tabler/icons-react';
import { Button, Modal } from '@mantine/core';
import { useInstructorDataContext } from '@/static/utils/InstructorDataContext/InstructorDataContext';
import CreateExamTabs from './CreateExamTabs/CreateExamTabs';

interface CreateExamModalProps {
  questions: Questions[];
}

interface Questions {
  question_id: number; // Ensure there is a unique identifier
  question_title: string;
  question_content: string;
  question_type: string;
}

export default function CreateExamModal({ questions }: CreateExamModalProps) {
  const [opened, setOpened] = useState(false);
  const openModal = () => setOpened(true);
  const closeModal = () => setOpened(false);

  // Use the context to get the selected course ID
  const { selectedCourseId } = useInstructorDataContext();

  return (
    <>
      <Modal opened={opened} onClose={closeModal} fullScreen>
        <CreateExamTabs closeModal={closeModal} questions={questions} />
      </Modal>
      <Button onClick={openModal} variant="filled" color="green">
        <IconPlus />
        Create Exam
      </Button>
    </>
  );
}
