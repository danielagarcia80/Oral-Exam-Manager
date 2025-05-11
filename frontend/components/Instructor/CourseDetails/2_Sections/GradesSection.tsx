'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Table,
  Button,
  Title,
  Loader,
  Text,
  Paper,
  Stack,
  Group,
} from '@mantine/core';

// Types
type Student = {
  student_id: string;
  student: {
    first_name: string;
    last_name: string;
    email: string;
  };
};

type Submission = {
  submission_id: string;
  student_id: string;
  recording_url: string;
  submitted_at: string;
  attempt_number: number;
  grade_percentage?: number;
};

export function GradesSection() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get('courseId');
  const examId = searchParams.get('examId');
  const router = useRouter();

  const [assignedStudents, setAssignedStudents] = useState<Student[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!examId) {return;}

    const fetchData = async () => {
      setLoading(true);
      try {
        const [studentsRes, submissionsRes] = await Promise.all([
          fetch(`http://localhost:4000/exams/${examId}/assigned-students`),
          fetch(`http://localhost:4000/exam-submissions/exam/${examId}`),
        ]);

        const studentsData = await studentsRes.json();
        const submissionsData = await submissionsRes.json();

        setAssignedStudents(Array.isArray(studentsData) ? studentsData : []);
        setSubmissions(Array.isArray(submissionsData) ? submissionsData : []);
      } catch (err) {
        console.error('Error fetching grades data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [examId]);

  const getSubmissions = (studentId: string) =>
    submissions
      .filter((s) => s.student_id === studentId)
      .sort(
        (a, b) =>
          new Date(b.submitted_at).getTime() -
          new Date(a.submitted_at).getTime()
      );

  if (loading) {
    return (
      <Group justify="center" mt="xl">
        <Loader />
      </Group>
    );
  }

  return (
    <Stack p="md">
      <Title order={3}>Grades Section</Title>
      <Paper shadow="xs" p="sm">
        <Table highlightOnHover withTableBorder>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Email</th>
              <th>Submissions</th>
            </tr>
          </thead>
          <tbody>
            {assignedStudents.map((assigned) => {
              const studentSubmissions = getSubmissions(assigned.student_id);
              const fullName = `${assigned.student.first_name} ${assigned.student.last_name}`;

              return (
                <tr key={assigned.student_id}>
                  <td>{fullName}</td>
                  <td>{assigned.student.email}</td>
                  <td>
                    {studentSubmissions.length > 0 ? (
                      <Stack gap="xs">
                        {studentSubmissions.map((submission) => (
                          <Paper
                            key={submission.attempt_number}
                            p="xs"
                            shadow="xs"
                            withBorder
                          >
                            <Group justify="space-between">
                              <div>
                                <Text size="sm">
                                  Attempt #{submission.attempt_number}
                                </Text>
                                <Text size="xs" c="dimmed">
                                  Submitted:{' '}
                                  {new Date(
                                    submission.submitted_at
                                  ).toLocaleString()}
                                </Text>
                                <Text size="sm">
                                  Grade:{' '}
                                  {submission.grade_percentage !== undefined
                                    ? `${submission.grade_percentage}%`
                                    : '—'}
                                </Text>
                              </div>
                              <Button
                                size="xs"
                                onClick={() =>
                                  router.push(
                                    `/instructor/view-recording?submissionId=${submission.submission_id}&courseId=${courseId}`
                                  )
                                }
                              >
                                View
                              </Button>
                            </Group>
                          </Paper>
                        ))}
                      </Stack>
                    ) : (
                      <Text c="red">No submissions</Text>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Paper>
    </Stack>
  );
}
