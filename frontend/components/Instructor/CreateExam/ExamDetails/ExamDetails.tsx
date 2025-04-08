'use client';

import {
  TextInput,
  Textarea,
  Select,
  Group,
  Title,
  Paper,
  Checkbox,
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

  durationMinutes: number;
  setDurationMinutes: (val: number) => void;
  timingMode: string;
  setTimingMode: (val: string) => void;

  requiresAudio: boolean;
  setRequiresAudio: (val: boolean) => void;
  requiresVideo: boolean;
  setRequiresVideo: (val: boolean) => void;
  requiresScreenShare: boolean;
  setRequiresScreenShare: (val: boolean) => void;
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
  durationMinutes,
  setDurationMinutes,
  timingMode,
  setTimingMode,
  requiresAudio,
  setRequiresAudio,
  requiresVideo,
  setRequiresVideo,
  requiresScreenShare,
  setRequiresScreenShare,
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
        onChange={(value) => value && setExamType(value)}
        data={[
          { value: 'ASYNCHRONOUS', label: 'Asynchronous' },
          { value: 'SYNCHRONOUS', label: 'Synchronous' },
          { value: 'PRACTICE', label: 'Practice' },
        ]}
        required
        mb="md"
      />

      <Group grow mb="md">
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

      {timingMode === 'OVERALL' && (
        <TextInput
          label="Duration (in minutes)"
          type="number"
          value={durationMinutes}
          onChange={(e) => setDurationMinutes(Number(e.currentTarget.value))}
          required
          mb="md"
        />
      )}



      <Select
        label="Timing Mode"
        value={timingMode}
        onChange={(val) => val && setTimingMode(val)}
        data={[
          { value: 'OVERALL', label: 'Overall (one timer for whole exam)' },
          { value: 'PER_QUESTION', label: 'Per Question (each question gets time)' },
        ]}
        required
        mb="md"
      />

      <Group mt="sm">
        <Checkbox
          label="Requires Audio"
          checked={requiresAudio}
          onChange={(e) => setRequiresAudio(e.currentTarget.checked)}
        />
        <Checkbox
          label="Requires Video"
          checked={requiresVideo}
          onChange={(e) => setRequiresVideo(e.currentTarget.checked)}
        />
        <Checkbox
          label="Requires Screen Share"
          checked={requiresScreenShare}
          onChange={(e) => setRequiresScreenShare(e.currentTarget.checked)}
        />
      </Group>
    </Paper>
  );
}
