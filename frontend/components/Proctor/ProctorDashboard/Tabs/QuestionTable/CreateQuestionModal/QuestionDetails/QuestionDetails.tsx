import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Group,
  Select,
  TagsInput,
  Textarea,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useInstructorDataContext } from '@/static/utils/InstructorDataContext/InstructorDataContext';
import classes from './QuestionDetails.module.css';

interface Props {
  closeModal: () => void;
}

interface FormValues {
  questionTitle: string;
  timeMinimumEnabled: boolean;
  timeMaximumEnabled: boolean;
  course_id: number; // Ensure this is a number
  questionContent: string;
  questionType: string;
}

const QuestionDetails: React.FC<Props> = ({ closeModal }) => {
  const { selectedCourseId } = useInstructorDataContext(); // Get the selected course ID from context
  const [keywordAreaVisible, setKeywordAreaVisible] = useState(true);
  const [keywordArray, setKeywordArray] = useState<string[]>([]);
  const [contextKeywordArray, setContextKeywordArray] = useState<string[]>([]);
  const [questionContent, setQuestionContent] = useState<string>('');
  const [contextKeywordVisible, setContextKeywordVisible] = useState(false);

  const form = useForm<FormValues>({
    initialValues: {
      questionTitle: '',
      timeMinimumEnabled: false,
      timeMaximumEnabled: false,
      course_id: selectedCourseId || 0, // Use selectedCourseId from context
      questionContent: '',
      questionType: '',
    },
  });

  useEffect(() => {
    if (selectedCourseId !== undefined && selectedCourseId !== null && !isNaN(selectedCourseId)) {
      form.setFieldValue('course_id', selectedCourseId);
    } else {
      console.error('Received invalid course_id:', selectedCourseId);
    }
  }, [selectedCourseId, form]);

  const handleCancel = () => {
    form.reset();
    closeModal();
  };

  const handleTypeChange = (value: string | null) => {
    setKeywordAreaVisible(value === 'Generalized');
    if (value) {
      form.setFieldValue('questionType', value);
      setContextKeywordVisible(value === 'Context');
    }
  };

  const updateQuestionContent = (value: string) => {
    setQuestionContent(value);
    form.setFieldValue('questionContent', value);
  };

  const updateKeywordArray = (value: string[]) => {
    setKeywordArray(value);
  };

  const handleCreateQuestion = async (values: FormValues) => {
    const payload = {
      ...values,
      keywords: keywordArray,
      contextKeywords: contextKeywordArray,
    };

    try {
      const response = await fetch('http://localhost:3001/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log('Question created successfully');
        window.location.reload();
      } else {
        const errorData = await response.json();
        console.error('Failed to create question:', errorData.message);
      }
    } catch (error) {
      console.error('Error creating question:', error);
    }
  };

  return (
    <>
      <Box maw={800} mx="auto">
        <form onSubmit={form.onSubmit(handleCreateQuestion)}>
          <TextInput
            size="xl"
            withAsterisk
            label="Question Title"
            placeholder="Question Title"
            {...form.getInputProps('questionTitle')}
            className={classes.inner}
            style={{ marginTop: '20px' }}
          />

          <Select
            size="xl"
            label="Question Type"
            placeholder="Pick a type"
            data={['Generalized', 'Keyword', 'Context']}
            defaultValue={'Generalized'}
            {...form.getInputProps('questionType')}
            allowDeselect={false}
            className={classes.inner}
            onChange={handleTypeChange}
            style={{ marginTop: '20px' }}
          />

          <div hidden={!keywordAreaVisible}>
            <Checkbox
              size="xl"
              className={classes.inner}
              label="Random Line"
              style={{ marginTop: '20px' }}
            />
          </div>

          <Textarea
            size="xl"
            resize="vertical"
            radius="md"
            label="Question Content:"
            {...form.getInputProps('questionContent')}
            description="Enter the question contents"
            placeholder="Input placeholder"
            className={classes.inner}
            value={questionContent}
            onChange={(event) => updateQuestionContent(event.currentTarget.value)}
            style={{ marginTop: '20px' }}
          />

          <div hidden={!contextKeywordVisible}>
            <TagsInput
              size="xl"
              label="Enter Context Keywords"
              value={contextKeywordArray}
              onChange={setContextKeywordArray}
              className={classes.inner}
              style={{ marginTop: '20px' }}
            />
          </div>

          <div hidden={keywordAreaVisible}>
            <TagsInput
              size="xl"
              label="Enter Keywords"
              placeholder="Random line will be selected containing these keywords"
              value={keywordArray}
              onChange={updateKeywordArray}
              clearable
              className={classes.inner}
              hidden={keywordAreaVisible}
            />
          </div>

          <Select
            size="xl"
            label="Question Priority"
            data={['Low', 'Medium', 'High']}
            defaultValue={'Medium'}
            allowDeselect={false}
            className={classes.inner}
            {...form.getInputProps('priority')}
            style={{ marginTop: '20px' }}
          />

          <Group mt="md" style={{ marginLeft: '10px' }}>
            <Divider my="sm" />
            <Button type="button" color="red" onClick={handleCancel} size="xl">
              Cancel
            </Button>
            <Button type="submit" color="green" size="xl">
              Create Question
            </Button>
          </Group>
        </form>
      </Box>
    </>
  );
};

export default QuestionDetails;
