'use client';

import { useEffect, useState } from 'react';
import {
  Stack,
  Title,
  TextInput,
  Button,
  Paper,
  Table,
  Group,
} from '@mantine/core';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStyles } from '../CourseDetails.styles';

interface Exam {
  exam_id: string;
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
}

export function ExamsSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get('courseId');

  const [exams, setExams] = useState<Exam[]>([]);
  const [search, setSearch] = useState('');

  const { classes } = useStyles();

  useEffect(() => {
    if (!courseId) {return;}

    const fetchExams = async () => {
      const res = await fetch(`http://localhost:4000/exams/course/${courseId}`);
      const data = await res.json();
      setExams(data);
    };

    fetchExams();
  }, [courseId]);

  const filteredExams = exams.filter((exam) =>
    exam.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Stack gap="sm" className={classes.section}>
      <Group justify="space-between" align="center">
        <Title order={4}>Exams</Title>
        <Group>
          <TextInput
            placeholder="Search exams..."
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            w={250}
          />
          <Button 
            size="sm" 
            variant="light"
            onClick={() => router.push(`/instructor/create-exam?courseId=${courseId}`)}
          >
            + New Exam
          </Button>
        </Group>
      </Group>

      <Paper className={classes.tableWrapper}>
        <Table highlightOnHover>
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>Exam Title</th>
              <th style={{ textAlign: 'left' }}>Date Range</th>
              <th style={{ textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredExams.map((exam) => (
              <tr key={exam.exam_id}>
                <td>{exam.title}</td>
                <td>
                  {new Date(exam.start_date).toLocaleDateString()} →{' '}
                  {new Date(exam.end_date).toLocaleDateString()}
                </td>
                <td>
                  <Button size="xs" variant="light">
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Paper>
    </Stack>
  );
}
