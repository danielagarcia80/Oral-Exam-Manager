'use client';

import { useEffect, useState } from 'react';
import {
  Stack,
  Title,
  TextInput,
  Table,
  Paper,
  Group,
} from '@mantine/core';
import { useSearchParams } from 'next/navigation';
import { useStyles } from '../CourseDetails.styles';
import { InvitePeopleForm } from '@/components/Instructor/CourseDetails/2_Sections/InvitePeopleForm';

interface Student {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export function StudentsSection() {
  const { classes } = useStyles();
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState('');
  const searchParams = useSearchParams();
  const courseId = searchParams.get('courseId');

  const loadStudents = async () => {
    if (!courseId) {return;}

    const res = await fetch(`http://localhost:4000/courses/${courseId}/students`);
    if (!res.ok) {
      console.error('Failed to fetch students');
      return;
    }

    const data = await res.json();
    setStudents(data);
  };

  useEffect(() => {
    loadStudents();
  }, [courseId]);

  const filtered = students.filter((s) =>
    `${s.first_name} ${s.last_name} ${s.email}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <Stack className={classes.section}>
      <Group justify="space-between" align="center">
        <Title order={4}>Enrolled Students</Title>
        <TextInput
          placeholder="Search students..."
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          w={250}
        />
      </Group>

      <Paper className={classes.tableWrapper}>
        <Table highlightOnHover>
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>First Name</th>
              <th style={{ textAlign: 'left' }}>Last Name</th>
              <th style={{ textAlign: 'left' }}>Email</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((student) => (
              <tr key={student.user_id}>
                <td>{student.first_name}</td>
                <td>{student.last_name}</td>
                <td>{student.email}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        {courseId && <InvitePeopleForm courseId={courseId} onInviteSuccess={loadStudents} />}
      </Paper>
    </Stack>
  );
}
