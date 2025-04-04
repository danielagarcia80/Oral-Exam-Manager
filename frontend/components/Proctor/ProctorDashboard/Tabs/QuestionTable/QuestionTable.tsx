import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  IconChevronDown,
  IconChevronUp,
  IconPlus,
  IconSearch,
  IconSelector,
} from '@tabler/icons-react';
import {
  Button,
  Center,
  Flex,
  Group,
  keys,
  Modal,
  NavLink,
  rem,
  ScrollArea,
  Table,
  Text,
  TextInput,
  UnstyledButton,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useInstructorDataContext } from '@/static/utils/InstructorDataContext/InstructorDataContext';
import CreateQuestion from './CreateQuestionModal/CreateQuestion';
import UpdateQuestionDetails from './EditQuestion/QuestionDetails/UpdateQuestionDetails';
import classes from './QuestionTable.module.css';

// ____________________________________________________________________________________________________________

interface QuestionData {
  question_id: number;
  question_title: string;
  question_content: string;
  question_type: string;
}

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort(): void;
}

// ____________________________________________________________________________________________________________

function Th({ children, reversed, sorted, onSort }: ThProps) {
  const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
  return (
    <Table.Th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group justify="space-between">
          <div className={classes.examTitle}>{children}</div>
          <Center className={classes.icon}>
            <Icon style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

// ____________________________________________________________________________________________________________

export function QuestionTableCopy() {
  const { courses, selectedCourseId } = useInstructorDataContext();
  const [sortedData, setSortedData] = useState<QuestionData[]>([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<keyof QuestionData | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionData>();
  const router = useRouter();
  const [opened, { open, close }] = useDisclosure(false);
  var selectedCourse = courses.find((course) => course.course_id === selectedCourseId);

  // ----------------------------------------------------------------------------------------------------------

  useEffect(() => {
    selectedCourse = courses.find((course) => course.course_id === selectedCourseId);
    if (selectedCourse) {
      setSortedData(selectedCourse.questions); // Assuming each course has a 'questions' array
    }
  }, [courses, selectedCourseId]);

  // ----------------------------------------------------------------------------------------------------------

  const sortData = (
    data: QuestionData[],
    payload: { sortBy: keyof QuestionData | null; reversed: boolean; search: string }
  ) => {
    const { sortBy } = payload;
    if (!sortBy) {
      return filterData(data, payload.search);
    }
    return filterData(
      [...data].sort((a, b) => {
        // Convert both values to strings to safely use localeCompare
        const valueA = String(a[sortBy]);
        const valueB = String(b[sortBy]);
        if (payload.reversed) {
          return valueB.localeCompare(valueA);
        }
        return valueA.localeCompare(valueB);
      }),
      payload.search
    );
  };

  // ----------------------------------------------------------------------------------------------------------

  const filterData = (data: QuestionData[], search: string) => {
    const query = search.toLowerCase().trim();
    return data.filter((item) =>
      keys(data[0]).some((key) => {
        const value = item[key];
        const stringValue = typeof value === 'string' ? value : String(value);
        return stringValue.toLowerCase().includes(query);
      })
    );
  };

  // ----------------------------------------------------------------------------------------------------------

  const setSorting = (field: keyof QuestionData) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(sortedData, { sortBy: field, reversed, search }));
  };

  // ----------------------------------------------------------------------------------------------------------

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(sortData(sortedData, { sortBy, reversed: reverseSortDirection, search: value }));
  };

  const handleRowClick = (question: QuestionData) => {
    setCurrentQuestion(question);
    open();
  };
  // ----------------------------------------------------------------------------------------------------------

  const rows = sortedData.map((row, index) => (
    <Table.Tr key={index} onClick={() => handleRowClick(row)}>
      <Table.Td>
        <NavLink
          label={
            <>
              <Text size="xl">
                {row.question_title} ({row.question_type})
              </Text>
              <Flex>
                <Text size="lg">{row.question_content}</Text>
              </Flex>
            </>
          }
        />
      </Table.Td>
    </Table.Tr>
  ));

  // ----------------------------------------------------------------------------------------------------------

  return (
    <>
      <Group
        gap={10}
        className={classes.links}
        style={{ margin: '2%' }}
        justify="space-between"
        wrap="nowrap"
      >
        <div>
          <TextInput
            size="md"
            style={{ marginLeft: '1%', marginRight: '1%', width: '100%' }}
            placeholder="Search for questions"
            leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={3.5} />}
            value={search}
            onChange={handleSearchChange}
          />
        </div>
        <CreateQuestion />
        <Modal opened={opened} onClose={close} size="55%">
          <UpdateQuestionDetails currentQuestion={currentQuestion} />
        </Modal>
      </Group>
      <ScrollArea className={classes.table}>
        <Table horizontalSpacing="md" verticalSpacing="xs" miw={700} layout="fixed" withTableBorder>
          <Table.Tbody>
            <Table.Tr className={classes.th} style={{ width: '100%', backgroundColor: '#f5f5f5' }}>
              <Th
                sorted={sortBy === 'question_title'}
                reversed={reverseSortDirection}
                onSort={() => setSorting('question_title')}
              >
                <Text style={{ fontWeight: '1000', fontSize: '26px' }} size="xl">
                  {selectedCourse?.course_title} Questions:
                </Text>
              </Th>
            </Table.Tr>
          </Table.Tbody>
          <Table.Tbody>
            {rows.length > 0 ? (
              rows
            ) : (
              <Table.Tr>
                <Table.Td colSpan={5}>
                  <Text fw={500} ta="center">
                    Nothing found
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </>
  );
}
