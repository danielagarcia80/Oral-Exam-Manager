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
  images?: {
    image: {
      image_id: string;
      image_data: string;
    };
  }[];
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

  const [newImageFile, setNewImageFile] = useState<File | null>(null); // for uploading new
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null); // for reusing existing

  const [existingImages, setExistingImages] = useState<{
    image_id: string;
    image_data: string;
    filename: string;
    path: string;
  }[]>([]);

  const [showEditImageModal, setShowEditImageModal] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);


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
      const questionId = questionData.question_id;

  
      // Step 2: Link to outcome
      await fetch('http://localhost:4000/question-outcomes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question_id: questionData.question_id,
          learning_outcome_id: targetOutcomeId,
        }),
      });

      // Step 3: Handle image
      let imageId = null;

      if (newImageFile) {
        const formData = new FormData();
        formData.append('file', newImageFile);
      
        const imageRes = await fetch(`http://localhost:4000/question-images/upload?courseId=${courseId}`, {
          method: 'POST',
          body: formData,
          // ❌ DO NOT set Content-Type header manually
          // headers: { 'Content-Type': 'multipart/form-data' }, ← this will break it!
        });
      
        const imageData = await imageRes.json();
        imageId = imageData.image_id;

      } else if (selectedImageId) {
        imageId = selectedImageId;
      }

      // Step 4: Link image to question if applicable
      if (imageId) {
        await fetch('http://localhost:4000/question-image-links', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question_id: questionId, image_id: imageId }),
        });
      }

      setShowQuestionModal(false);
      setQuestionText('');
      setTargetOutcomeId(null);
      setNewImageFile(null);
      setSelectedImageId(null);
  
      // Refresh
      const res = await fetch(`http://localhost:4000/courses/${courseId}/question-bank`);
      const updated = await res.json();
      setData(updated);
    } catch (err) {
      console.error('Error adding question:', err);
    }
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
        // Remove old links first
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
  
      // Refresh data
      const res = await fetch(`http://localhost:4000/courses/${courseId}/question-bank`);
      const updated = await res.json();
      setData(updated);
    } catch (err) {
      console.error('Error updating question image:', err);
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
  
    // Fetch images if either modal is open
    if (!showQuestionModal && !showEditImageModal) {return;}
  
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
  }, [courseId, showQuestionModal, showEditImageModal]);
  
  // console.log('existingImages in dropdown:', existingImages);
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

        <Modal
          opened={showEditImageModal}
          onClose={() => setShowEditImageModal(false)}
          title="Edit Question Image"
        >
          <form onSubmit={handleUpdateQuestionImage}>
            {/* Upload new image */}
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

            {/* Select existing image */}
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
                        {q.images?.map((imgLink) => (
                          <img
                            key={imgLink.image.image_id}
                            src={`http://localhost:4000${imgLink.image.image_data}`} // ✅ full URL
                            alt="Question"
                            style={{ maxWidth: '100%', maxHeight: 200, marginTop: 8, borderRadius: 8 }}
                          />
                        ))}
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

                      <Select
                        label="Type"
                        value={type}
                        onChange={(val) => val && setType(val)}
                        data={[
                          { value: 'FREE_RESPONSE', label: 'Free Response' },
                        ]}
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

                      {/* Upload new image */}
                      <TextInput
                        label="Upload New Image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.currentTarget.files?.[0]) {
                            setNewImageFile(e.currentTarget.files[0]);
                            setSelectedImageId(null); // disable selection if uploading
                          }
                        }}
                        mt="sm"
                      />

                      {/* OR select an existing image */}
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
                          label: img.filename, // ✅ use `filename` not `original_filename`
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
