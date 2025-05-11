'use client';

import {
  TextInput,
  Textarea,
  Select,
  Group,
  Title,
  Paper,
  Checkbox,
  Button,
  Divider,
  Stack,
  Text,
  Collapse
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useEffect, useState } from 'react';

type Student = {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
};

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

  selectedStudentIds: string[];
  setSelectedStudentIds: (val: string[]) => void;

  courseId: string | null;

  manualAssign: boolean;
  setManualAssign: (val: boolean) => void;

  allowedAttempts: number;
  setAllowedAttempts: (val: number) => void;
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
  selectedStudentIds,
  setSelectedStudentIds,
  courseId,
  manualAssign,
  setManualAssign,
  allowedAttempts,
  setAllowedAttempts,
}: ExamDetailsProps) {

  const [students, setStudents] = useState<Student[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(true);

  useEffect(() => {
    if (!courseId) { return };
    const fetchStudents = async () => {
      try {
        setLoadingStudents(true);
        const res = await fetch(`http://localhost:4000/courses/${courseId}/students`);
        const data = await res.json();
        setStudents(data);
        setSelectedStudentIds(data.map((s: Student) => s.user_id));
      } catch (err) {
        console.error('Failed to fetch students:', err);
      } finally {
        setLoadingStudents(false);
      }
    };
  
    fetchStudents();
  }, [courseId]);
  

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

      <TextInput
        label="Allowed Attempts"
        type="number"
        min={1}
        value={allowedAttempts}
        onChange={(e) => setAllowedAttempts(Number(e.currentTarget.value))}
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
      
      <Divider my="md" label="Assign to Students" labelPosition="center" />

      <Checkbox
        label="Manually assign this exam to specific students"
        checked={manualAssign}
        onChange={(e) => setManualAssign(e.currentTarget.checked)}
        mt="md"
      />

      <Collapse in={manualAssign}>
        {loadingStudents ? (
          <Text mt="sm">Loading students...</Text>
        ) : (
          <>
            <Button
              size="xs"
              mt="sm"
              onClick={() => {
                if (selectedStudentIds.length === students.length) {
                  setSelectedStudentIds([]); // Deselect all
                } else {
                  setSelectedStudentIds(students.map((s) => s.user_id)); // Select all
                }
              }}
            >
              {selectedStudentIds.length === students.length ? 'Deselect All' : 'Select All'}
            </Button>

            <Stack mt="sm">
              {students.map((student) => (
                <Checkbox
                  key={student.user_id}
                  label={`${student.first_name} ${student.last_name} (${student.email})`}
                  checked={selectedStudentIds.includes(student.user_id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedStudentIds([...selectedStudentIds, student.user_id]);
                    } else {
                      setSelectedStudentIds(
                        selectedStudentIds.filter((id) => id !== student.user_id)
                      );
                    }
                  }}
                />
              ))}
            </Stack>
          </>
        )}
      </Collapse>
    </Paper>
  );
}
