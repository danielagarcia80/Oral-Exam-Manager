'use client';

import { useEffect, useState } from 'react';
import {
  Stack,
  Title,
  Text,
  Paper,
  Accordion,
  Button,
  Group,
  Modal,
  TextInput,
  Select,
} from '@mantine/core';
import { useSearchParams } from 'next/navigation';
import { useStyles } from '../CourseDetails.styles';

interface Question {
  question_id: string;
  text: string;
  difficulty: number;
  type: string;
}

interface OutcomeBlock {
  outcomeId: string;
  description: string;
  questions: Question[];
}

export function QuestionBankSection() {
  const { classes } = useStyles();

  const searchParams = useSearchParams();
  const courseId = searchParams.get('courseId');
  const [data, setData] = useState<OutcomeBlock[]>([]);

  const [showOutcomeModal, setShowOutcomeModal] = useState(false);
  const [newOutcome, setNewOutcome] = useState('');

  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [targetOutcomeId, setTargetOutcomeId] = useState<string | null>(null);

  const [questionText, setQuestionText] = useState('');
  const [difficulty, setDifficulty] = useState<number>(1);
  const [type, setType] = useState(''); // or 'multiple-choice'

  const handleAddLearningOutcome = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId || !newOutcome.trim()) {return;}
  
    try {
      // Step 1: Create LearningOutcome
      const outcomeRes = await fetch('http://localhost:4000/learning-outcomes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: newOutcome }),
      });
  
      const outcomeData = await outcomeRes.json();
      const outcomeId = outcomeData.learning_outcome_id;
  
      // Step 2: Link to course
      await fetch('http://localhost:4000/course-learning-outcomes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          course_id: courseId,
          learning_outcome_id: outcomeId,
        }),
      });
  
      setNewOutcome('');
      setShowOutcomeModal(false);
      // Re-fetch data
      const res = await fetch(`http://localhost:4000/courses/${courseId}/question-bank`);
      const updated = await res.json();
      setData(updated);
    } catch (err) {
      console.error('Error adding outcome:', err);
    }
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetOutcomeId || !questionText.trim()) {return;}
  
    try {
      // Step 1: Create question
      const questionRes = await fetch('http://localhost:4000/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: questionText,
          difficulty,
          type,
          source: 'manual',
          max_duration_minutes: 10,
        }),
      });
  
      const questionData = await questionRes.json();
  
      // Step 2: Link to outcome
      await fetch('http://localhost:4000/question-outcomes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question_id: questionData.question_id,
          learning_outcome_id: targetOutcomeId,
        }),
      });
  
      setShowQuestionModal(false);
      setQuestionText('');
      setTargetOutcomeId(null);
  
      // Refresh
      const res = await fetch(`http://localhost:4000/courses/${courseId}/question-bank`);
      const updated = await res.json();
      setData(updated);
    } catch (err) {
      console.error('Error adding question:', err);
    }
  };
  

  useEffect(() => {
    const fetchData = async () => {
      if (!courseId) {return;}

      const res = await fetch(`http://localhost:4000/courses/${courseId}/question-bank`);
      const data = await res.json();
      setData(data);
    };

    fetchData();
  }, [courseId]);

  return (
    <Stack className={classes.section}>
      <Group justify="space-between" align="center">
        <Title order={4}>Question Bank</Title>
        <Button size="sm" variant="light" onClick={() => setShowOutcomeModal(true)}>
          + Add Learning Outcome
        </Button>

        <Modal
          opened={showOutcomeModal}
          onClose={() => setShowOutcomeModal(false)}
          title="Add Learning Outcome"
        >
          <form onSubmit={handleAddLearningOutcome}>
            <TextInput
              label="Description"
              placeholder="Enter outcome description..."
              value={newOutcome}
              onChange={(e) => setNewOutcome(e.currentTarget.value)}
              required
            />
            <Button type="submit" mt="sm">
              Add
            </Button>
          </form>
        </Modal>

      </Group>

      <Paper className={classes.tableWrapper}>
        <Accordion multiple variant="separated">
          {data.map((outcome) => (
            <Accordion.Item key={outcome.outcomeId} value={outcome.outcomeId}>
              <Accordion.Control>{outcome.description}</Accordion.Control>
              <Accordion.Panel>
                <Stack gap="xs">
                  {outcome.questions.length > 0 ? (
                    outcome.questions.map((q) => (
                      <Paper key={q.question_id} className={classes.questionCard}>
                        <Text>{q.text}</Text>
                        <Text size="xs" c="dimmed">
                          Type: {q.type}, Difficulty: {q.difficulty}
                        </Text>
                      </Paper>
                    ))
                  ) : (
                    <Text size="sm" c="dimmed">
                      No questions for this outcome.
                    </Text>
                  )}
                  <Button
                    size="xs"
                    variant="light"
                    mt="sm"
                    onClick={() => {
                      setTargetOutcomeId(outcome.outcomeId);
                      setShowQuestionModal(true);
                    }}
                  >
                    + Add Question
                  </Button>


                  <Modal
                    opened={showQuestionModal}
                    onClose={() => setShowQuestionModal(false)}
                    title="Add Question"
                  >
                    <form onSubmit={handleAddQuestion}>
                      <TextInput
                        label="Question Text"
                        value={questionText}
                        onChange={(e) => setQuestionText(e.currentTarget.value)}
                        required
                      />

                      <TextInput
                        label="Type"
                        value={type}
                        onChange={(e) => setType(e.currentTarget.value)}
                        required
                        mt="sm"
                      />

                      <Select
                        label="Difficulty"
                        type="number"
                        value={difficulty.toString()}
                        onChange={(e) => setDifficulty(Number(e))}
                        required
                        data={[
                          { value: '1', label: '1' },
                          { value: '2', label: '2' },
                          { value: '3', label: '3' },
                        ]}
                        mb="sm"
                      />

                      <Button type="submit" mt="md">
                        Submit
                      </Button>
                    </form>
                  </Modal>

                </Stack>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </Paper>
    </Stack>
  );
}
