import { useEffect, useState } from 'react';
import {
  IconChevronDown,
  IconChevronUp,
  IconEdit,
  IconSearch,
  IconSelector,
} from '@tabler/icons-react';
import {
  Button,
  Center,
  Checkbox,
  Container,
  Divider,
  Flex,
  Group,
  rem,
  ScrollArea,
  Table,
  Text,
  TextInput,
  UnstyledButton,
} from '@mantine/core';
import classes from './QuestionsByTopic.module.css';

interface RowData {
  question_id: number; // Ensure there is a unique identifier
  question_title: string;
  question_content: string;
  question_type: string;
}

interface Props {
  questionProp: RowData[];
  examQuestions: RowData[];

  setExamQuestions: (newQuestions: RowData[]) => void;
  updateExamQuestions: (newQuestions: RowData[]) => void;
  closeModal?: () => void;
}

function QuestionsByTopic({
  questionProp,
  examQuestions,
  setExamQuestions,
  updateExamQuestions,
  closeModal,
}: Props) {
  const [questions, setQuestions] = useState<RowData[]>(questionProp);
  const [search, setSearch] = useState('');
  const [sortedData, setSortedData] = useState<RowData[]>([]);
  const [sortBy, setSortBy] = useState<keyof RowData | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [selectedRows, setSelectedRows] = useState<RowData[]>([]);

  function updateExams() {
    setExamQuestions(selectedRows);
    updateExamQuestions(selectedRows);
    if (closeModal) {
      closeModal(); // Close the modal after updating
    }
  }

  useEffect(() => {
    setSortedData(questions);
    setSelectedRows(examQuestions);
  }, [questions, examQuestions]);

  const handleCheckboxChange = (question: RowData, isChecked: boolean) => {
    setSelectedRows((prev) => {
      if (isChecked) {
        return [...prev, question]; // Add to selected rows
      } else {
        return prev.filter((item) => item.question_id !== question.question_id); // Remove using unique identifier
      }
    });
  };

  const rows = sortedData.map((question) => (
    <Table.Tr key={question.question_id}>
      <Table.Td>
        <Flex align="center">
          <Checkbox
            aria-label="Select row"
            checked={selectedRows.some((row) => row.question_id === question.question_id)}
            onChange={(event) => handleCheckboxChange(question, event.currentTarget.checked)}
          />
          <div className={classes.inner}>
            <div>
              <Text size="xl" style={{ fontWeight: 500 }}>
                {question.question_title}
              </Text>
              <Text size="xl">{question.question_content}</Text>
            </div>
          </div>
        </Flex>
      </Table.Td>
      <Table.Td>{question.question_type}</Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      {/* <Container className={classes.searchContainer}>
        <TextInput
          placeholder="Search by question"
          mb="md"
          leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
        />
      </Container> */}
      <ScrollArea>
        <Table horizontalSpacing="md" verticalSpacing="xs" layout="fixed" highlightOnHover>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </ScrollArea>

      <Divider style={{ padding: '20px' }} />
      <Flex style={{ width: '100%' }}>
        <Button
          style={{ marginLeft: '35%', marginBottom: '20px' }}
          size="xl"
          onClick={updateExams}
          variant="default"
        >
          Update Exam Questions
        </Button>
      </Flex>
    </>
  );
}

export default QuestionsByTopic;
