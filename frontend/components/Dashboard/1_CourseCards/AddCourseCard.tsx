'use client';

import { Card, Center, Text } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useDashboardStyles } from '../Dashboard.styles';

export function AddCourseCard() {
  const router = useRouter();
  const styles = useDashboardStyles();

  return (
    <Card
      style= {styles.courseCard}
      onClick={() => router.push('/instructor/create-course')}
    >
      <Center style={{ height: '100%', flexDirection: 'column' }}>
        <IconPlus size={32} stroke={1.5} />
        <Text size="sm" mt="xs" c="dimmed">
          Add new course
        </Text>
      </Center>
    </Card>
  );
}
