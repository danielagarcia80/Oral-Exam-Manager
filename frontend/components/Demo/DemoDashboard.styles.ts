import { useMantineTheme } from '@mantine/core';

export function useStudentDashboardStyles() {
  const theme = useMantineTheme();

  return {
    section: {
      marginBottom: theme.spacing.lg,
    },
    courseCard: {
      border: `1px solid ${theme.colors.dark[4]}`,
      padding: theme.spacing.md,
      borderRadius: theme.radius.md,
    },
    tableWrapper: {
      padding: theme.spacing.sm,
      borderRadius: theme.radius.md,
      border: `1px solid ${theme.colors.dark[4]}`,
    },
  };
}
