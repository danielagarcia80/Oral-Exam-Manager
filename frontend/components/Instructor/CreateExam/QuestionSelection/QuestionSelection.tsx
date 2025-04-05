'use client';

import {
  Accordion,
  Button,
  Checkbox,
  Group,
  Modal,
  Paper,
  Stack,
  Text,
  TextInput,
  Textarea,
  Select,
  Title,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useStyles } from '../../CourseDetails/CourseDetails.styles';

interface Question {
  question_id: string;
  text: string;
  type: string;
  difficulty: number;
}

interface LearningOutcome {
  outcomeId: string;
  description: string;
  questions: Question[];
}

interface QuestionSelectionProps {
  selectedQuestions: string[];
  setSelectedQuestions: (ids: string[]) => void;
}

export function QuestionSelection({
  selectedQuestions,
  setSelectedQuestions,
}: QuestionSelectionProps) {
  const { classes } = useStyles();
  const searchParams = useSearchParams();
  const courseId = searchParams.get('courseId');

  const [outcomes, setOutcomes] = useState<LearningOutcome[]>([]);

  const [newOutcomeModalOpen, setNewOutcomeModalOpen] = useState(false);
  const [newOutcome, setNewOutcome] = useState('');

  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [questionOutcomeId, setQuestionOutcomeId] = useState<string | null>(null);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionType, setNewQuestionType] = useState('SIMPLE');
  const [newDifficulty, setNewDifficulty] = useState(1);

  useEffect(() => {
    const fetchOutcomes = async () => {
      if (!courseId) {return;}
      const res = await fetch(`http://localhost:4000/courses/${courseId}/question-bank`);
      const data = await res.json();
      setOutcomes(data);
    };
    fetchOutcomes();
  }, [courseId]);

  const toggleQuestion = (id: string) => {
    if (selectedQuestions.includes(id)) {
      setSelectedQuestions(selectedQuestions.filter((q) => q !== id));
    } else {
      setSelectedQuestions([...selectedQuestions, id]);
    }
  };

  const handleAddLearningOutcome = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId || !newOutcome.trim()) {return;}

    const outcomeRes = await fetch('http://localhost:4000/learning-outcomes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description: newOutcome }),
    });

    const outcomeData = await outcomeRes.json();
    const outcomeId = outcomeData.learning_outcome_id;

    await fetch('http://localhost:4000/course-learning-outcomes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        course_id: courseId,
        learning_outcome_id: outcomeId,
      }),
    });

    setNewOutcome('');
    setNewOutcomeModalOpen(false);

    const res = await fetch(`http://localhost:4000/courses/${courseId}/question-bank`);
    const updated = await res.json();
    setOutcomes(updated);
  };

  const handleAddQuestionClick = (outcomeId: string) => {
    setQuestionOutcomeId(outcomeId);
    setQuestionModalOpen(true);
  };

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionOutcomeId) {return;}

    const questionRes = await fetch('http://localhost:4000/questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: newQuestionText,
        type: newQuestionType,
        difficulty: newDifficulty,
        source: 'manual',
        max_duration_minutes: 5,
      }),
    });

    const questionData = await questionRes.json();
    const questionId = questionData.question_id;

    await fetch('http://localhost:4000/question-outcomes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question_id: questionId,
        learning_outcome_id: questionOutcomeId,
      }),
    });

    setNewQuestionText('');
    setNewQuestionType('SIMPLE');
    setNewDifficulty(1);
    setQuestionModalOpen(false);

    const res = await fetch(`http://localhost:4000/courses/${courseId}/question-bank`);
    const updated = await res.json();
    setOutcomes(updated);
  };

  return (
    <Stack className={classes.section}>
      <Group justify="space-between" align="center">
        <Title order={4}>Select Questions</Title>
        <Button size="sm" variant="light" onClick={() => setNewOutcomeModalOpen(true)}>
          + Add Learning Outcome
        </Button>
      </Group>

      <Paper className={classes.tableWrapper}>
        <Accordion multiple variant="separated">
          {outcomes.map((outcome) => (
            <Accordion.Item key={outcome.outcomeId} value={outcome.outcomeId}>
              <Accordion.Control>{outcome.description}</Accordion.Control>
              <Accordion.Panel>
                <Stack gap="xs">
                  {outcome.questions.length > 0 ? (
                    outcome.questions.map((q) => (
                      <Checkbox
                        key={q.question_id}
                        label={`${q.text} (Type: ${q.type}, Difficulty: ${q.difficulty})`}
                        checked={selectedQuestions.includes(q.question_id)}
                        onChange={() => toggleQuestion(q.question_id)}
                      />
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
                    onClick={() => handleAddQuestionClick(outcome.outcomeId)}
                  >
                    + Add Question
                  </Button>
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </Paper>

      {/* Modal: Add Learning Outcome */}
      <Modal
        opened={newOutcomeModalOpen}
        onClose={() => setNewOutcomeModalOpen(false)}
        title="Add Learning Outcome"
      >
        <form onSubmit={handleAddLearningOutcome}>
          <TextInput
            label="Description"
            value={newOutcome}
            onChange={(e) => setNewOutcome(e.currentTarget.value)}
            required
          />
          <Button type="submit" mt="md">
            Submit
          </Button>
        </form>
      </Modal>

      {/* Modal: Add Question */}
      <Modal
        opened={questionModalOpen}
        onClose={() => setQuestionModalOpen(false)}
        title="Add Question"
      >
        <form onSubmit={handleSubmitQuestion}>
          <Textarea
            label="Question Text"
            value={newQuestionText}
            onChange={(e) => setNewQuestionText(e.currentTarget.value)}
            required
            mb="sm"
          />
          <TextInput
            label="Type"
            placeholder="e.g. free-response"
            value={newQuestionType}
            onChange={(e) => setNewQuestionType(e.currentTarget.value)}
            mb="sm"
          />
          <Select
            label="Difficulty"
            value={newDifficulty.toString()}
            onChange={(val) => val && setNewDifficulty(Number(val))}
            data={[
              { value: '1', label: '1' },
              { value: '2', label: '2' },
              { value: '3', label: '3' },
              { value: '4', label: '4' },
              { value: '5', label: '5' },
            ]}
            mb="sm"
          />
          <Button type="submit" mt="sm">
            Add Question
          </Button>
        </form>
      </Modal>
    </Stack>
  );
}
