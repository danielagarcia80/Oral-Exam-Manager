import { SegmentedControl } from '@mantine/core';

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: 'exams' | 'question_bank' | 'students' | 'grades') => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <SegmentedControl
      fullWidth
      value={activeTab}
      onChange={(value) => onTabChange(value as any)}
      data={[
        { label: 'Exams', value: 'exams' },
        { label: 'Question Bank', value: 'question_bank' },
        { label: 'Students', value: 'students' },
        { label: 'Grades', value: 'grades' },
      ]}
      mt="md"
      mb="lg"
    />
  );
}
