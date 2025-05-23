import { useState } from 'react';
import { IconPlus } from '@tabler/icons-react';
import { Button, Modal } from '@mantine/core';
import { useInstructorDataContext } from '@/static/utils/InstructorDataContext/InstructorDataContext';
import QuestionDetails from './QuestionDetails/QuestionDetails';

const CreateQuestion: React.FC = () => {
  const { selectedCourseId } = useInstructorDataContext(); // Get the selected course ID from context
  const [opened, setOpened] = useState(false);

  const openModal = () => setOpened(true);
  const closeModal = () => setOpened(false);

  return (
    <>
      <Button onClick={openModal} variant="filled" color="green" leftSection={<IconPlus />}>
        Create Question
      </Button>

      <Modal opened={opened} onClose={closeModal} size="lg" title="Create New Question">
        <QuestionDetails closeModal={closeModal} />
      </Modal>
    </>
  );
};

export default CreateQuestion;
