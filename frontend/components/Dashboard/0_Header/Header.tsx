'use client';

import { signOut, useSession } from 'next-auth/react';
import { Button, Flex, Text, Title } from '@mantine/core';
import { useDashboardStyles } from '../Dashboard.styles';

type HeaderProps = {
  studentName?: string;
};

export function Header({ studentName = 'Student' }: HeaderProps) {
  const { classes } = useDashboardStyles();
  const { data: session, status } = useSession();

  const isLoggedIn = status === 'authenticated';
  const userName = session?.user?.name || studentName;
  const userRole = session?.user?.role;

  return (
    <Flex justify="space-between" align="center" className={classes.section}>
      <div>
        <Title order={2}>Hello, {userName}</Title>
        {isLoggedIn && (
          <Text size="sm" c="dimmed">
            Logged in as {session.user?.email} ({userRole})
          </Text>
        )}
      </div>
    </Flex>
  );
}
