'use client';

import { signOut, useSession } from 'next-auth/react';
import { Button, Flex, Text, TextInput, Title } from '@mantine/core';
import { useStudentDashboardStyles } from '../StudentDashboard.styles';

type HeaderProps = {
  studentName?: string;
};

export function Header({ studentName = 'Student' }: HeaderProps) {
  const styles = useStudentDashboardStyles();
  const { data: session, status } = useSession();

  const isLoggedIn = status === 'authenticated';
  const userName = session?.user?.name || studentName;
  const userRole = session?.user?.role;

  return (
    <Flex justify="space-between" align="center" style={styles.section}>
      <div>
        <Title order={2}>Hello, {userName}</Title>
        {isLoggedIn && (
          <Text size="sm" c="dimmed">
            Logged in as {session.user?.email} ({userRole})
          </Text>
        )}
      </div>

      <Flex align="center" gap="sm">
        <TextInput placeholder="Search" w={250} />
        {isLoggedIn && (
          <Button
            variant="outline"
            color="red"
            onClick={() => signOut({ callbackUrl: '/auth/signin' })}
          >
            Logout
          </Button>
        )}
      </Flex>
    </Flex>
  );
}
