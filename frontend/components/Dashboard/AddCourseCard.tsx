'use client';

import { Card, Center, Text } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

export function AddCourseCard() {
  const router = useRouter();

  return (
    <Card
      withBorder
      shadow="sm"
      radius="md"
      style={{ cursor: 'pointer', minHeight: 120 }}
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
