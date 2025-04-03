'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Stack, Group, Title, TextInput, Paper, Table, Button } from '@mantine/core';
import { useDashboardStyles } from '../Dashboard.styles';

type Exam = {
  exam_id: string;
  title: string;
  description: string;
  type: string;
  start_date: string;
  end_date: string;
  course_id: string;
};

export function InstructorExams() {
  const { data: session } = useSession();
  const [exams, setExams] = useState<Exam[]>([]);
  const [search, setSearch] = useState('');

  const styles = useDashboardStyles();

  useEffect(() => {
    const fetchExams = async () => {
      const userId = session?.user?.id;
      if (!userId) {return;}

      const res = await fetch(`http://localhost:4000/exams/instructor/${userId}`);

      const data = await res.json();
      setExams(data);
    };

    fetchExams();
  }, [session?.user?.id]);

  const filteredExams = exams.filter((exam) =>
    exam.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Stack gap="sm" style={styles.section}>
      <Group justify="space-between" align="center">
        <Title order={4}>Your Exams</Title>
        <TextInput
          placeholder="Search exams..."
          w={250}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
        />
      </Group>

      <Paper style={styles.tableWrapper}>
        <Table highlightOnHover>
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>Exam Name</th>
              <th style={{ textAlign: 'left', width: '240px' }}>Start → End</th>
              <th style={{ textAlign: 'left', width: '120px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredExams.map((exam) => (
              <tr key={exam.exam_id}>
                <td>{exam.title}</td>
                <td>
                  {new Date(exam.start_date).toLocaleString()} →{' '}
                  {new Date(exam.end_date).toLocaleString()}
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
