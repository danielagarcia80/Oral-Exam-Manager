'use client';

import { Flex, TextInput, Title } from '@mantine/core';
import { useStudentDashboardStyles } from '../DemoDashboard.styles';

type HeaderProps = {
  studentName?: string;
};

export function Header({ studentName = 'Student' }: HeaderProps) {
  const styles = useStudentDashboardStyles();

  return (
    <Flex justify="space-between" align="center" style={styles.section}>
      <Title order={2}>Hello, {studentName}</Title>
      <TextInput placeholder="Search" w={250} />
    </Flex>
  );
}
