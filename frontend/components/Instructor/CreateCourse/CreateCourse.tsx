'use client';

import {
  TextInput,
  Textarea,
  Button,
  Stack,
  Group,
  Title,
  Paper,
  FileInput,
  Container,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function CreateCourseForm() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [courseId, setCourseId] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  const handleSubmit = async () => {
    const formData = new FormData();

    formData.append('title', title);
    formData.append('course_id', courseId);
    formData.append('description', description);
    formData.append('start_date', startDate?.toISOString() || '');
    formData.append('end_date', endDate?.toISOString() || '');

    if (bannerFile) {
      formData.append('banner', bannerFile);
    }

    const res = await fetch('http://localhost:4000/courses', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      router.push('/dashboard'); // or show a success screen
    }else {
      console.error('Failed to create course:', res.statusText);
    }
  };

  return (
    <Container pt="md">
      <Paper p="md" shadow="sm" radius="md" withBorder>
        <Stack gap="md">
          <Title order={3}>Create New Course</Title>

          <TextInput
            label="Course Title"
            value={title}
            onChange={(e) => setTitle(e.currentTarget.value)}
          />

          <TextInput
            label="Course ID"
            value={courseId}
            onChange={(e) => setCourseId(e.currentTarget.value)}
          />

          <Textarea
            label="Course Description"
            value={description}
            onChange={(e) => setDescription(e.currentTarget.value)}
          />

          <Group align="flex-start" grow>
            <DatePickerInput
              label="Start Date"
              value={startDate}
              onChange={setStartDate}
              size="sm"
              radius="md"
              popoverProps={{ withinPortal: true }}
            />
            <DatePickerInput
              label="End Date"
              value={endDate}
              onChange={setEndDate}
              size="sm"
              radius="md"
              popoverProps={{ withinPortal: true }}
            />
          </Group>

          <FileInput
            label="Course Banner"
            value={bannerFile}
            onChange={setBannerFile}
            accept="image/*"
          />

          <Group justify="flex-end">
            <Button variant="default" onClick={() => router.push('/dashboard')}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Create</Button>
          </Group>
        </Stack>
      </Paper>
    </Container>
  );
}
