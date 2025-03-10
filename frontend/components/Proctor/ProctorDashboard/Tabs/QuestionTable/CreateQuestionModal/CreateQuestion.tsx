import { useState } from 'react';
import { Button, Modal } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import QuestionDetails from './QuestionDetails/QuestionDetails';
import { useInstructorDataContext } from '@/static/utils/InstructorDataContext/InstructorDataContext';

const CreateQuestion: React.FC = () => {
    const { selectedCourseId } = useInstructorDataContext(); // Get the selected course ID from context
    const [opened, setOpened] = useState(false);

    const openModal = () => setOpened(true);
    const closeModal = () => setOpened(false);

    return (
        <>
            <Button
                onClick={openModal}
                variant="filled"
                color="green"
                leftSection={<IconPlus />}
            >
                Create Question
            </Button>

            <Modal
                opened={opened}
                onClose={closeModal}
                size="lg"
                title="Create New Question"
            >
                <QuestionDetails closeModal={closeModal} />
            </Modal>
        </>
    );
};

export default CreateQuestion;
