import { Box, Checkbox, TextInput, Button, Textarea, Flex, TagsInput, Modal } from "@mantine/core";
import { useForm } from '@mantine/form';
import { IconDeviceFloppy, IconTrash } from "@tabler/icons-react";
import classes from '../../ExamDetails.module.css';
import React, { useState } from "react";
import DateTimeEntry from "../../CreateExamModal/CreateExamTabs/ExamDetails/DateTimeEntry";
import { useInstructorDataContext } from "@/static/utils/InstructorDataContext/InstructorDataContext";

// ____________________________________________________________________________________________________________

interface ExamData {
  exam_id: number;
  exam_title: string;
  exam_instructions: string;
  available_from: string;
  available_to: string;
  access_code: string;
}

interface ModalContentProps {
  examData?: ExamData | null;
  onExamSaved: (examId: number) => Promise<void>;
}

interface FormValues {
  examTitle: string;
  examInstructions: string;
  timeMinimumEnabled: boolean;
  timeMaximumEnabled: boolean;
  accessCodeEnabled: boolean;
  availableFrom: string;
  availableTo: string;
  access_code: string;
}

// ____________________________________________________________________________________________________________

const EditExam: React.FC<ModalContentProps> = ({ examData, onExamSaved }: ModalContentProps) => {
  const [openedMessageModal, setMessageOpened] = useState(false);
  const closeMessageModal = () => setMessageOpened(false);
  const { selectedCourseId } = useInstructorDataContext();
  const form = useForm<FormValues>({
    initialValues: {
      examTitle: examData?.exam_title || '',
      examInstructions: examData?.exam_instructions || '',
      timeMinimumEnabled: false,
      timeMaximumEnabled: false,
      accessCodeEnabled: examData?.access_code ? true : false,
      availableFrom: examData?.available_from || '',  // Use ISO string for initial value and convert when using
      availableTo: examData?.available_to || '',
      access_code: examData?.access_code || ''
    },
    validate: {},
  });

  const handleFormSubmit = async (values: FormValues) => {
    const url = examData ? `http://localhost:3001/exams/${examData.exam_id}` : `http://localhost:3001/exams/${selectedCourseId}`;
    const method = examData ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          course_id: selectedCourseId,
          exam_title: values.examTitle,
          exam_instructions: values.examInstructions,
          available_from: values.availableFrom,
          available_to: values.availableTo,
          access_code: values.access_code,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save exam');
      }
      const data = await response.json();
      onExamSaved(data.exam_id);
    } catch (error) {
      console.error('Error saving exam:', error);
    }
  };

  const handleDeleteExam = async () => {
    if (examData && examData.exam_id) {
      const confirmDelete = window.confirm("Are you sure you want to delete this exam?");
      if (confirmDelete) {
        try {
          const response = await fetch(`http://localhost:3001/exams/${examData.exam_id}`, {
            method: 'DELETE'
          });

          const data = await response.json();

          if (response.ok) {
            window.location.reload();
          } else {
            throw new Error(data.message || "Failed to delete exam");
          }
        } catch (error) {
          console.error('Error deleting exam:', error);
        }
      }
    }
  };

  return (
    <Box maw={800} mx="auto">
      <form onSubmit={form.onSubmit(handleFormSubmit)}>
        <TextInput
          size="xl"
          style={{ paddingTop: "10px" }}
          withAsterisk
          label="Exam Title"
          placeholder="Exam Title"
          {...form.getInputProps('examTitle')}
          className={classes.inner}
        />
        <TagsInput
          style={{ paddingTop: "10px" }}
          size="xl"
          label="Assigned to:"
          className={classes.inner}
          defaultValue={['All Students']}
          data={[
            'All Students',
            'Shaun Rose (srose@csumb.edu)',
            'Wes Aman (waman@csumb.edu)',
            'Sameer Dingore (sdingore@csumb.edu)'
          ]}
        />
        <Textarea
          style={{ paddingTop: "10px" }}
          size="xl"
          resize="vertical"
          radius="md"
          label="Exam Instructions:"
          description="These will be shown at the beginning of the exam."
          placeholder="Input placeholder"
          className={classes.inner}
          {...form.getInputProps('examInstructions')}
        />
        <div className={classes.inner}
          style={{ paddingTop: "10px" }}>
          <DateTimeEntry form={form} />
        </div>
        <Flex
          style={{ paddingTop: "10px" }}>
          <TextInput
            size="xl"
            withAsterisk
            label="Access code"
            placeholder="Access Code"
            className={classes.inner}
            disabled={!form.values.accessCodeEnabled}
            {...form.getInputProps('access_code')}

          // style={{margin}}
          />
          <Checkbox
            style={{ paddingTop: "27px" }}
            size="xl"
            mt="md"
            {...form.getInputProps('accessCodeEnabled', { type: 'checkbox' })}
            className={classes.inner}

          />
        </Flex>
        <Button
          size="xl"
          color="red"
          type="button"
          leftSection={<IconTrash />}
          style={{ marginLeft: "25px", marginTop: "30px" }}
          onClick={handleDeleteExam}
        >
          Delete Exam
        </Button>
        <Modal opened={openedMessageModal} onClose={closeMessageModal}>
        </Modal>
        <Button
          size="xl"
          style={{ marginLeft: "55px", marginTop: "30px" }}
          color="green"
          type="submit"
          leftSection={<IconDeviceFloppy />}
        >
          Update Exam
        </Button>
      </form>
    </Box>
  );
}

export default EditExam;
