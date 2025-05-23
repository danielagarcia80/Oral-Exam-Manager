import React, { useState } from 'react';
import { IconDeviceFloppy, IconTrash } from '@tabler/icons-react';
import { Box, Button, Checkbox, Flex, Modal, Space, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useInstructorDataContext } from '@/static/utils/InstructorDataContext/InstructorDataContext';
import AreYouSure from './AreYouSure';
import DateTimeEntry from './DateTimeEntry';
import classes from './ExamDetails.module.css';

interface FormValues {
  examTitle: string;
  examInstructions: string;
  timeMinimumEnabled: boolean;
  timeMaximumEnabled: boolean;
  accessCodeEnabled: boolean;
  availableFrom: string;
  availableTo: string;
  accessCode: string;
}

interface ModalContentProps {
  closeModal: () => void;
  onExamSaved: (examId: number) => Promise<void>; // Callback prop for handling saved exam
}

const ExamDetails: React.FC<ModalContentProps> = ({
  closeModal,
  onExamSaved,
}: ModalContentProps) => {
  const [openedMessageModal, setMessageOpened] = useState(false);
  const openMessageModal = () => setMessageOpened(true);
  const closeMessageModal = () => setMessageOpened(false);

  const { selectedCourseId } = useInstructorDataContext(); // Get the selectedCourseId from context

  const form = useForm<FormValues>({
    initialValues: {
      examTitle: '',
      examInstructions: '',
      timeMinimumEnabled: false,
      timeMaximumEnabled: false,
      accessCodeEnabled: false,
      availableFrom: new Date().toISOString(),
      availableTo: new Date().toISOString(),
      accessCode: '',
    },
    validate: {},
  });

  const handleFormSubmit = async (values: FormValues) => {
    try {
      if (!selectedCourseId) {
        throw new Error('No course selected');
      }

      console.log(values.availableFrom);
      const response = await fetch(`http://localhost:3001/exams/${selectedCourseId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          course_id: selectedCourseId,
          exam_title: values.examTitle,
          exam_instructions: values.examInstructions,
          available_from: values.availableFrom,
          available_to: values.availableTo,
          access_code: values.accessCode,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create exam');
      }
      const data = await response.json();
      console.log('Exam created successfully:', data);
      onExamSaved(data.exam_id);
    } catch (error) {
      console.error('Error creating exam:', error);
    }
  };

  const handleCancel = () => {
    closeModal();
  };

  return (
    <Box maw={1000} mx="auto">
      <form onSubmit={form.onSubmit(handleFormSubmit)}>
        <TextInput
          size="xl"
          withAsterisk
          label="Exam Title"
          placeholder="Exam Title"
          {...form.getInputProps('examTitle')}
          className={classes.inner}
        />
        <Textarea
          size="xl"
          resize="vertical"
          radius="md"
          label="Exam Instructions:"
          description="These will be shown at the beginning of the exam."
          {...form.getInputProps('examInstructions')}
          placeholder="Input placeholder"
          className={classes.inner}
        />
        <div className={classes.inner}>
          <DateTimeEntry form={form} />
        </div>
        <Flex>
          <TextInput
            size="xl"
            withAsterisk
            label="Access code"
            placeholder="Access Code"
            className={classes.inner}
            disabled={!form.values.accessCodeEnabled}
            {...form.getInputProps('accessCode')}
          />
          <Checkbox
            size="xl"
            mt="md"
            {...form.getInputProps('accessCodeEnabled', { type: 'checkbox' })}
            className={classes.inner}
            style={{ paddingTop: '24px' }}
          />
        </Flex>
        <div className={classes.inner}>
          <Button
            color="red"
            type="button"
            onClick={handleCancel}
            leftSection={<IconTrash />}
            style={{ marginLeft: '0%', marginRight: '10%', width: '200px' }}
            size="xl"
          >
            Cancel
          </Button>
          <Modal opened={openedMessageModal} onClose={closeMessageModal}>
            <AreYouSure closeModal={closeMessageModal} closeMessageModal={closeMessageModal} />
          </Modal>
          <Button
            size="xl"
            color="green"
            type="submit"
            leftSection={<IconDeviceFloppy />}
            style={{ margin: '5%', width: '200px' }}
          >
            Save Exam
          </Button>
        </div>
      </form>
    </Box>
  );
};

export default ExamDetails;
