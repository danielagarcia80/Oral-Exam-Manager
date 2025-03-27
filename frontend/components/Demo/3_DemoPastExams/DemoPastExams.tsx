'use client';

import { Table, TextInput, Title, Group, Stack, Paper, Button } from '@mantine/core';
import { useStudentDashboardStyles } from '../DemoDashboard.styles';


type Exam = {
  id: string;
  name: string;
  dueDate: string;
};

const mockPastExams: Exam[] = [
  { id: '1', name: 'Quiz 1 - Computer Architecture', dueDate: '2025-02-20' },
  { id: '2', name: 'Midterm - Algorithms', dueDate: '2025-03-01' },
  { id: '3', name: 'Practice - Operating Systems', dueDate: '2025-03-10' },
];

export function PastExams() {

  const styles = useStudentDashboardStyles();

  return (
    <Stack gap="sm" style={styles.section}>
      <Group justify="space-between" align="center">
        <Title order={4}>Past Exams</Title>
        <TextInput placeholder="Search past exams..." w={250} />
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
            {mockPastExams.map((exam) => (
              <tr key={exam.id}>
                <td>{exam.name}</td>
                <td>{exam.dueDate}</td>
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
