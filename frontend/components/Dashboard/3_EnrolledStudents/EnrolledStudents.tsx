'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  Stack,
  Group,
  Title,
  TextInput,
  Paper,
  Table,
  Button,
} from '@mantine/core';
import { useDashboardStyles } from '../Dashboard.styles'; // adjust if path differs

type Student = {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
};

export function EnrolledStudents() {
  const { data: session } = useSession();
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState('');

  const { classes } = useDashboardStyles();

  useEffect(() => {
    const fetchStudents = async () => {
      const userId = session?.user?.id;
      if (!userId) {return;}

      const res = await fetch(`http://localhost:4000/users/instructor/${userId}/students`);

      const data = await res.json();
      setStudents(data);
    };

    fetchStudents();
  }, [session?.user?.id]);

  const filteredStudents = students.filter((student) =>
    `${student.first_name} ${student.last_name}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <Stack gap="sm" className={classes.section}>
      <Group justify="space-between" align="center">
        <Title order={4}>Your Students</Title>
        <TextInput
          placeholder="Search students..."
          w={250}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
        />
      </Group>

      <Paper className={classes.tableWrapper}>
        <Table highlightOnHover>
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>Name</th>
              <th style={{ textAlign: 'left' }}>Email</th>
              <th style={{ textAlign: 'left', width: '120px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.user_id}>
                <td>{student.first_name} {student.last_name}</td>
                <td>{student.email}</td>
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
