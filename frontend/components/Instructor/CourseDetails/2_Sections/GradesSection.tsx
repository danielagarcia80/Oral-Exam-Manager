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

type Student = {
  student_id: string;
  student: {
    first_name: string;
    last_name: string;
    email: string;
  };
};

type Submission = {
  student_id: string;
  recording_url: string;
};

export function GradesSection() {
  const searchParams = useSearchParams();
  const examId = searchParams.get('examId');
  const router = useRouter();

  const [assignedStudents, setAssignedStudents] = useState<Student[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!examId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [studentsRes, submissionsRes] = await Promise.all([
  fetch(`http://localhost:4000/exams/${examId}/assigned-students`),
  fetch(`http://localhost:4000/exam-submissions/exam/${examId}`),
  
]);



        const studentsData = await studentsRes.json();
        const submissionsData = await submissionsRes.json();

        // Confirm they're arrays
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

  const getSubmission = (studentId: string) =>
    submissions.find((s) => s.student_id === studentId);

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
              <th style={{ textAlign: 'left' }}>Student Name</th>
              <th style={{ textAlign: 'left' }}>Email</th>
              <th style={{ textAlign: 'left' }}>Status</th>
              <th style={{ textAlign: 'left' }}>Grade</th> 
              <th style={{ textAlign: 'left' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {assignedStudents.map((assigned) => {
              const submission = getSubmission(assigned.student_id);
              const fullName = `${assigned.student.first_name} ${assigned.student.last_name}`;
              const submitted = Boolean(submission);

              return (
                <tr key={assigned.student_id}>
                  <td>{fullName}</td>
                  <td>{assigned.student.email}</td>
                  <td>
                    {submitted ? (
                      <Text c="green">Submitted</Text>
                    ) : (
                      <Text c="red">Not Submitted</Text>
                    )}
                  </td>

                  <td>
                    {submitted && submission?.grade_percentage !== undefined
                      ? `${submission.grade_percentage}%`
                      : '—'}
                  </td>



                  <td>
                    <Button
                      size="xs"
                      disabled={!submitted}
                      onClick={() =>
                        router.push(
                          `/instructor/view-recording?studentId=${assigned.student_id}&examId=${examId}`
                        )
                      }
                    >
                      View Recording
                    </Button>
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
