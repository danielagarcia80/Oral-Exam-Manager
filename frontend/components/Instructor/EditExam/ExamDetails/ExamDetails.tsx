'use client';

import {
  TextInput,
  Textarea,
  Select,
  Group,
  Title,
  Paper,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';

interface ExamDetailsProps {
  title: string;
  setTitle: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  examType: string;
  setExamType: (val: string) => void;
  startDate: Date | null;
  setStartDate: (date: Date | null) => void;
  endDate: Date | null;
  setEndDate: (date: Date | null) => void;
}

export function ExamDetails({
  title,
  setTitle,
  description,
  setDescription,
  examType,
  setExamType,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}: ExamDetailsProps) {
  return (
    <Paper p="lg" withBorder radius="md" mb="lg">
      <Title order={3} mb="md">Exam Details</Title>

      <TextInput
        label="Title"
        placeholder="e.g. Final Exam"
        value={title}
        onChange={(e) => setTitle(e.currentTarget.value)}
        required
        mb="md"
      />

      <Textarea
        label="Description"
        placeholder="Optional description"
        value={description}
        onChange={(e) => setDescription(e.currentTarget.value)}
        mb="md"
      />

      <Select
        label="Exam Type"
        placeholder="Select type"
        value={examType}
        onChange={(value) => {
          if (value) {setExamType(value);}
        }}
        data={[
          { value: 'ASYNCHRONOUS', label: 'Asynchronous' },
          { value: 'SYNCHRONOUS', label: 'Synchronous' },
          { value: 'PRACTICE', label: 'Practice' },
        ]}
        required
        mb="md"
      />

      <Group grow>
        <DatePickerInput
          label="Start Date"
          value={startDate}
          onChange={setStartDate}
          required
        />
        <DatePickerInput
          label="End Date"
          value={endDate}
          onChange={setEndDate}
          required
        />
      </Group>
    </Paper>
  );
}
