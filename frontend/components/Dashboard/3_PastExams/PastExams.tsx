'use client';

import { Button, Group, Paper, Stack, Table, TextInput, Title } from '@mantine/core';
import { useDashboardStyles } from '../Dashboard.styles';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

type Exam = {
  exam_id: string;
  title: string;
  description: string;
  type: string;
  start_date: Date;
  end_date: Date;
  course_id: string;
  course?: { title: string };
  submission?: {
    grade_percentage?: number;
    feedback?: string;
  };
};



export function PastExams() {
  const { data: session } = useSession();
  const [exams, setExams] = useState<Exam[]>([]);
  const [search, setSearch] = useState('');

  const { classes } = useDashboardStyles();

  useEffect(() => {
    const fetchExams = async () => {
      const userId = session?.user?.id;
      if (!userId) {return;}

      const res = await fetch(`http://localhost:4000/exams/student/past/${userId}`);
      if (!res.ok) {
        console.error('Failed to fetch upcoming exams');
        return;
      }

      const data = await res.json();
      setExams(data);
    };

    fetchExams();
  }, [session]);

  const filteredExams = exams.filter((exam) =>
    exam.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Stack gap="sm" className={classes.section}>
      <Group justify="space-between" align="center">
        <Title order={4}>Past Exams</Title>
        <TextInput 
          placeholder="Search past exams..." 
          w={250} 
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
        />
      </Group>

      <Paper className={classes.tableWrapper}>
        <Table highlightOnHover>
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>Exam Name</th>
              <th style={{ textAlign: 'left' }}>Course</th>
              <th style={{ textAlign: 'left', width: '240px' }}>Due Date</th>
              <th style={{ textAlign: 'left', width: '120px' }}>Grade</th>
              <th style={{ textAlign: 'left', width: '120px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredExams.map((exam) => (
              <tr key={exam.exam_id}>
                <td>{exam.title}</td>
                <td>{exam.course?.title}</td>
                <td>{new Date(exam.end_date).toLocaleString()}</td>
                <td>
                  {exam.submission?.grade_percentage !== null &&
                  exam.submission?.grade_percentage !== undefined
                    ? `${exam.submission.grade_percentage}%`
                    : '—'}
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
