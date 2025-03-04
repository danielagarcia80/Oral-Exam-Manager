import { useEffect, useState } from 'react';
import { Box, Group, Checkbox, TextInput, Button, Textarea, Divider, TagsInput, Select } from "@mantine/core";
import { useForm } from '@mantine/form';
import classes from './EditQuestionDetails.module.css';
import { useInstructorDataContext } from '@/static/utils/InstructorDataContext/InstructorDataContext';

interface Props {
    currentQuestion: QuestionData | undefined;
}

interface FormValues {
    questionTitle: string | undefined;
    timeMinimumEnabled: boolean | undefined;
    timeMaximumEnabled: boolean | undefined;
    course_id: number | undefined;  // Ensure this is a number
    questionContent: string | undefined;
    questionType: string | undefined;
}

interface QuestionData {
    question_id: number;
    question_title: string;
    question_content: string;
    question_type: string;
}

export default function UpdateQuestionDetails({ currentQuestion }: Props) {
    const { selectedCourseId } = useInstructorDataContext(); // Get the selected course ID from context
    const [keywordAreaVisible, setKeywordAreaVisible] = useState(true);
    const [keywordArray, setKeywordArray] = useState<string[]>([]);
    const [questionContent, setQuestionContent] = useState<string>('');

    const form = useForm<FormValues>({
        initialValues: {
            questionTitle: currentQuestion?.question_title,
            timeMinimumEnabled: false,
            timeMaximumEnabled: false,
            course_id: selectedCourseId || 0,  // Use selectedCourseId from context
            questionContent: currentQuestion?.question_content,
            questionType: currentQuestion?.question_type
        },
    });

    useEffect(() => {
        setKeywordAreaVisible(currentQuestion?.question_type === 'Generalized');
        if (selectedCourseId !== undefined && selectedCourseId !== null && !isNaN(selectedCourseId)) {
            form.setFieldValue('course_id', selectedCourseId);
        } else {
            console.error("Received invalid course_id:", selectedCourseId);
        }
    }, [selectedCourseId, form]);

    const handleDeleteQuestion = async () => {
        if (!currentQuestion || !currentQuestion.question_id) {
            console.error('Error: No current question selected');
            return;
        }

        if (window.confirm("Are you sure you want to delete this question?")) {
            try {
                const response = await fetch(`http://localhost:3001/questions/${currentQuestion.question_id}`, {
                    method: 'DELETE',
                });

                const responseData = await response.json();
                if (response.ok) {
                    console.log('Question deleted successfully');
                    window.location.reload(); // Refresh the page to reflect the deletion
                } else {
                    throw new Error(responseData.message || "Failed to delete question");
                }
            } catch (error) {
                console.error('Error deleting question:', error);
            }
        }
    };

    const handleTypeChange = (value: string | null) => {
        setKeywordAreaVisible(value === 'Generalized');
        if (value) {
            form.setFieldValue('questionType', value);
        }
    };

    const updateQuestionContent = (value: string) => {
        setQuestionContent(value);
        form.setFieldValue('questionContent', value);
    };

    const updateKeywordArray = (value: string[]) => {
        setKeywordArray(value);
    };

    const handleUpdateQuestion = async (values: FormValues) => {
        if (!currentQuestion || !currentQuestion.question_id) {
            console.error('Error: No current question selected');
            return;
        }

        const questionId = currentQuestion.question_id;

        console.log('UpdateQuestion:', values);
        if (!values.course_id || !values.questionTitle || !values.questionContent) {
            console.error('Validation error: Missing required fields');
            return;
        }

        const payload = {
            ...values,
            keywords: keywordArray
        };

        try {
            const response = await fetch(`http://localhost:3001/questions/${questionId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const responseData = await response.json();
            if (response.ok) {
                console.log('Question updated successfully');
                window.location.reload();
            } else {
                console.error('Failed to update question:', responseData.message);
            }
        } catch (error) {
            console.error('Error updating question:', error);
        }
    };

    useEffect(() => {
        const fetchKeywords = async () => {
            if (currentQuestion && currentQuestion.question_id) {
                try {
                    const response = await fetch(`http://localhost:3001/questions/${currentQuestion.question_id}/keywords`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch keywords');
                    }
                    const keywords = await response.json();
                    setKeywordArray(keywords); // Assuming the API returns an array of strings
                } catch (error) {
                    console.error('Error fetching keywords:', error);
                }
            }
        };
        fetchKeywords();
        console.log(keywordArray);
    }, [currentQuestion]);

    return (
        <>
            <Box maw={800} mx="auto">
                <form onSubmit={form.onSubmit(handleUpdateQuestion)}>
                    <TextInput
                        size="xl"
                        style={{ marginTop: "20px" }}
                        withAsterisk
                        label="Question Title"
                        placeholder="Question Title"
                        {...form.getInputProps('questionTitle')}
                        className={classes.inner}
                    />

                    <Select
                        size="xl"
                        style={{ marginTop: "20px" }}
                        label="Question Type"
                        placeholder="Pick a type"
                        data={['Generalized', 'Keyword', 'Context']}
                        defaultValue={'Generalized'}
                        {...form.getInputProps('questionType')}
                        allowDeselect={false}
                        className={classes.inner}
                        onChange={handleTypeChange}
                    />

                    <div hidden={!keywordAreaVisible}>
                        <Checkbox
                            size="xl"
                            style={{ marginTop: "20px" }}
                            className={classes.inner}
                            label="Random Line"
                        />
                    </div>

                    <Textarea
                        size="xl"
                        style={{ marginTop: "20px" }}
                        resize="vertical"
                        radius="md"
                        label="Question Content:"
                        {...form.getInputProps('questionContent')}
                        placeholder="Input placeholder"
                        className={classes.inner}
                        onChange={(event) => updateQuestionContent(event.currentTarget.value)}
                    />

                    <div hidden={keywordAreaVisible}>
                        <TagsInput
                            size="xl"
                            style={{ marginTop: "20px" }}
                            label="Enter Keywords"
                            placeholder='Random lines that contain these keywords will be highlighted.'
                            value={keywordArray}
                            onChange={updateKeywordArray}
                            clearable
                            className={classes.inner}
                            hidden={keywordAreaVisible}
                        />
                    </div>

                    <Select
                        size="xl"
                        style={{ marginTop: "20px" }}
                        label="Question Priority"
                        data={['Low', 'Medium', 'High']}
                        defaultValue={'Medium'}
                        allowDeselect={false}
                        className={classes.inner}
                        {...form.getInputProps('priority')}
                    />

                    <Group mt="md">
                        <Divider my="sm" />
                        <Button type="button" color="red" onClick={handleDeleteQuestion} size="xl" style={{ margin: "10px" }}>Delete Question</Button>
                        <Button type="submit" color="green" size="xl" style={{ margin: "10px" }}>Update Question</Button>
                    </Group>
                </form>
            </Box>
        </>
    );
}
