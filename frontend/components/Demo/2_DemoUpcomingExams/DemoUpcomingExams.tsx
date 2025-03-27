'use client';

import { Button, Group, Paper, Stack, Table, TextInput, Title } from '@mantine/core';
import { useStudentDashboardStyles } from '../DemoDashboard.styles';


type Exam = {
  id: string;
  name: string;
  dueDate: string;
};

const mockExams: Exam[] = [
  { id: '1', name: 'Midterm - Computer Architecture', dueDate: '2025-04-01' },
  { id: '2', name: 'Quiz - Algorithms', dueDate: '2025-04-05' },
  { id: '3', name: 'Final - Operating Systems', dueDate: '2025-04-12' },
];

export function UpcomingExams() {

  const styles = useStudentDashboardStyles();

  return (
    <Stack gap="sm" style={styles.section}>
      <Group justify="space-between" align="center">
        <Title order={4}>Upcoming Exams</Title>
        <TextInput placeholder="Search exams..." w={250} />
      </Group>

      <Paper style={styles.tableWrapper}>
        <Table highlightOnHover>
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>Exam Name</th>
              <th style={{ textAlign: 'left', width: '240px' }}>Due Date</th>
              <th style={{ textAlign: 'left', width: '120px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockExams.map((exam) => (
              <tr key={exam.id}>
                <td>{exam.name}</td>
                <td>{exam.dueDate}</td>
                <td>
                  <Button size="xs" variant="light">
                    Take Exam
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
