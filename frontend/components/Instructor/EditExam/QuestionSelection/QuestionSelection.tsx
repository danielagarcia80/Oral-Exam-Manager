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
  images?: {
    image: {
      image_id: string;
      image_data: string;
    };
  }[];
}


interface LearningOutcome {
  outcomeId: string;
  description: string;
  questions: Question[];
}

interface QuestionSelectionProps {
  selectedQuestions: string[];
  setSelectedQuestions: (ids: string[]) => void;
  timingMode: string;
  questionTimeMap: Record<string, number>;
  setQuestionTimeMap: (map: Record<string, number>) => void;
  questionKeywordsMap: Record<string, string[]>;
  setQuestionKeywordsMap: (map: Record<string, string[]>) => void;
}



export function QuestionSelection({
  selectedQuestions,
  setSelectedQuestions,
  timingMode,
  questionTimeMap,
  setQuestionTimeMap,
  questionKeywordsMap,
  setQuestionKeywordsMap,
}: QuestionSelectionProps) {




  const { classes } = useStyles();
  const searchParams = useSearchParams();
  const courseId = searchParams.get('courseId');

  const [outcomes, setOutcomes] = useState<LearningOutcome[]>([]);
  const [newQuestionKeywords, setNewQuestionKeywords] = useState('');


  const [newOutcomeModalOpen, setNewOutcomeModalOpen] = useState(false);
  const [newOutcome, setNewOutcome] = useState('');

  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [questionOutcomeId, setQuestionOutcomeId] = useState<string | null>(null);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionType, setNewQuestionType] = useState('SIMPLE');
  const [newDifficulty, setNewDifficulty] = useState(1);

  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [existingImages, setExistingImages] = useState<{
    image_id: string;
    image_data: string;
    filename: string;
    path: string;
  }[]>([]);
  const [showEditImageModal, setShowEditImageModal] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);


  useEffect(() => {
    const fetchOutcomes = async () => {
      if (!courseId) {return;}
      const res = await fetch(`http://localhost:4000/courses/${courseId}/question-bank`);
      const data = await res.json();
      setOutcomes(data);
    };
    fetchOutcomes();
  
    if (!questionModalOpen && !showEditImageModal) {return;}
  
    const fetchImages = async () => {
      try {
        const res = await fetch(`http://localhost:4000/question-images?courseId=${courseId}`);
        const images = await res.json();
        setExistingImages(images);
      } catch (err) {
        console.error('Failed to fetch images:', err);
      }
    };
  
    fetchImages();
  }, [courseId, questionModalOpen, showEditImageModal]);
  

  const toggleQuestion = (id: string) => {
    if (selectedQuestions.includes(id)) {
      setSelectedQuestions(selectedQuestions.filter((q) => q !== id));
      const updatedMap = { ...questionTimeMap };
      delete updatedMap[id];
      setQuestionTimeMap(updatedMap);
    } else {
      setSelectedQuestions([...selectedQuestions, id]);
      if (timingMode === 'PER_QUESTION') {
        setQuestionTimeMap({ ...questionTimeMap, [id]: 1 }); // default 1 min
      }
    }
  };

  const updateTimeForQuestion = (id: string, time: number) => {
    setQuestionTimeMap({ ...questionTimeMap, [id]: time });
  };

  const updateKeywordsForQuestion = (questionId: string, input: string) => {
    const keywords = input
      .split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0);

    setQuestionKeywordsMap({ ...questionKeywordsMap, [questionId]: keywords });
  };

  const totalTime = Object.values(questionTimeMap).reduce((sum, t) => sum + t, 0);

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

  const handleUpdateQuestionImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestionId) {return;}
  
    try {
      let imageId = null;
  
      if (newImageFile) {
        const formData = new FormData();
        formData.append('file', newImageFile);
  
        const imageRes = await fetch(`http://localhost:4000/question-images/upload?courseId=${courseId}`, {
          method: 'POST',
          body: formData,
        });
  
        const imageData = await imageRes.json();
        imageId = imageData.image_id;
      } else if (selectedImageId) {
        imageId = selectedImageId;
      }
  
      if (imageId) {
        await fetch(`http://localhost:4000/question-image-links/${editingQuestionId}`, {
          method: 'DELETE',
        });
  
        await fetch('http://localhost:4000/question-image-links', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question_id: editingQuestionId, image_id: imageId }),
        });
      }
  
      setShowEditImageModal(false);
      setEditingQuestionId(null);
      setNewImageFile(null);
      setSelectedImageId(null);
  
      const res = await fetch(`http://localhost:4000/courses/${courseId}/question-bank`);
      const updated = await res.json();
      setOutcomes(updated);
    } catch (err) {
      console.error('Error updating question image:', err);
    }
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

    const keywords = newQuestionKeywords
      .split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0);

    for (const keywordText of keywords) {
      await fetch('http://localhost:4000/question-keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question_id: questionId,
          keyword_text: keywordText,
        }),
      });
    }


    await fetch('http://localhost:4000/question-outcomes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question_id: questionId,
        learning_outcome_id: questionOutcomeId,
      }),
    });

    // Handle image upload or selection
    let imageId = null;
    if (newImageFile) {
      const formData = new FormData();
      formData.append('file', newImageFile);

      const imageRes = await fetch(`http://localhost:4000/question-images/upload?courseId=${courseId}`, {
        method: 'POST',
        body: formData,
      });

      const imageData = await imageRes.json();
      imageId = imageData.image_id;
    } else if (selectedImageId) {
      imageId = selectedImageId;
    }

    if (imageId) {
      await fetch('http://localhost:4000/question-image-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question_id: questionId, image_id: imageId }),
      });
    }

    setNewQuestionText('');
    setNewQuestionType('SIMPLE');
    setNewDifficulty(1);
    setNewImageFile(null);
    setSelectedImageId(null);
    setQuestionModalOpen(false);
    setNewQuestionKeywords('');


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
                      <Paper key={q.question_id} p="sm" withBorder>
                        <Stack gap="xs">
                          <Checkbox
                            label={`${q.text} (Type: ${q.type}, Difficulty: ${q.difficulty})`}
                            checked={selectedQuestions.includes(q.question_id)}
                            onChange={() => toggleQuestion(q.question_id)}
                          />

                          {q.images?.map((imgLink) => (
                            <img
                              key={imgLink.image.image_id}
                              src={`http://localhost:4000${imgLink.image.image_data}`}
                              alt="Question"
                              style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8, marginTop: 8 }}
                            />
                          ))}

                          <Group gap="sm">
                            <Button
                              size="xs"
                              variant="default"
                              onClick={() => {
                                setEditingQuestionId(q.question_id);
                                setShowEditImageModal(true);
                              }}
                            >
                              Edit Image
                            </Button>

                            {timingMode === 'PER_QUESTION' && selectedQuestions.includes(q.question_id) && (
                              <TextInput
                                label="Time (min)"
                                type="number"
                                size="xs"
                                style={{ width: 100 }}
                                value={questionTimeMap[q.question_id]?.toString() || ''}
                                onChange={(e) =>
                                  updateTimeForQuestion(q.question_id, Number(e.currentTarget.value))
                                }
                                min={1}
                              />
                            )}
                          </Group>

                          
                        </Stack>
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
                    onClick={() => handleAddQuestionClick(outcome.outcomeId)}
                  >
                    + Add Question
                  </Button>

                  {timingMode === 'PER_QUESTION' && selectedQuestions.length > 0 && (
                    <Text mt="md" size="sm">
                      Total Time: <b>{totalTime} minutes</b>
                    </Text>
                  )}
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
          <Select
            label="Type"
            value={newQuestionType}
            onChange={(val) => val && setNewQuestionType(val)}
            data={[{ value: 'FREE_RESPONSE', label: 'Free Response' }]}
            required
            mt="sm"
          />
          <Select
            label="Difficulty"
            value={newDifficulty.toString()}
            onChange={(val) => val && setNewDifficulty(Number(val))}
            data={[
              { value: '1', label: '1' },
              { value: '2', label: '2' },
              { value: '3', label: '3' },
            ]}
            mb="sm"
          />

          <TextInput
            label="Keywords"
            placeholder="e.g., loop, function, return"
            value={newQuestionKeywords}
            onChange={(e) => setNewQuestionKeywords(e.currentTarget.value)}
            mb="sm"
          />

          <TextInput
            label="Upload New Image"
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.currentTarget.files?.[0]) {
                setNewImageFile(e.currentTarget.files[0]);
                setSelectedImageId(null);
              }
            }}
            mt="sm"
          />

          <Select
            label="Select Existing Image"
            placeholder="Choose image"
            value={selectedImageId}
            onChange={(val) => {
              setSelectedImageId(val);
              setNewImageFile(null);
            }}
            data={existingImages.map((img) => ({
              value: img.image_id,
              label: img.filename,
            }))}
            mt="sm"
          />

          {selectedImageId && (
            <>
              <Text size="sm" mt="md" mb="xs">Selected Image Preview:</Text>
              <Paper
                withBorder
                p="xs"
                style={{
                  display: 'inline-block',
                  borderColor: '#228be6',
                  borderWidth: 2,
                  borderRadius: 8,
                }}
              >
                <img
                  src={`http://localhost:4000${
                    existingImages.find((img) => img.image_id === selectedImageId)?.path || ''
                  }`}
                  alt="Selected"
                  style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8 }}
                />
              </Paper>
            </>
          )}

          <Button type="submit" mt="md">
            Add Question
          </Button>
        </form>
      </Modal>

      <Modal
        opened={showEditImageModal}
        onClose={() => setShowEditImageModal(false)}
        title="Edit Question Image"
      >
        <form onSubmit={handleUpdateQuestionImage}>
          <TextInput
            label="Upload New Image"
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.currentTarget.files?.[0]) {
                setNewImageFile(e.currentTarget.files[0]);
                setSelectedImageId(null);
              }
            }}
            mt="sm"
          />

          <Select
            label="Select Existing Image"
            placeholder="Choose image"
            value={selectedImageId}
            onChange={(val) => {
              setSelectedImageId(val);
              setNewImageFile(null);
            }}
            data={existingImages.map((img) => ({
              value: img.image_id,
              label: img.filename,
            }))}
            mt="sm"
          />

          {selectedImageId && (
            <>
              <Text size="sm" mt="md" mb="xs">Selected Image Preview:</Text>
              <Paper
                withBorder
                p="xs"
                style={{
                  display: 'inline-block',
                  borderColor: '#228be6',
                  borderWidth: 2,
                  borderRadius: 8,
                }}
              >
                <img
                  src={`http://localhost:4000${
                    existingImages.find((img) => img.image_id === selectedImageId)?.path || ''
                  }`}
                  alt="Selected"
                  style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8 }}
                />
              </Paper>
            </>
          )}

          <Button type="submit" mt="md">
            Save Image
          </Button>
        </form>
      </Modal>
    </Stack>
  );
}
