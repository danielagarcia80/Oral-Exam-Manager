import { createStyles } from '@mantine/styles';

export const useStyles = createStyles((theme) => ({
  section: {
    marginBottom: theme.spacing.lg,
  },

  courseCard: {
    border: `1px solid ${theme.colors.dark[4]}`,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    cursor: 'pointer',
    transition: 'transform 150ms ease, box-shadow 150ms ease',

    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    },
  },

  tableWrapper: {
    padding: theme.spacing.sm,
    borderRadius: theme.radius.md,
    border: `1px solid ${theme.colors.dark[4]}`,
  },
}));
