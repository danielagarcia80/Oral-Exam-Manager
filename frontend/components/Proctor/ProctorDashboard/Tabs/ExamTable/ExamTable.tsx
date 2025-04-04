import React, { useEffect, useState } from 'react';
import {
  IconArticle,
  IconChevronDown,
  IconChevronUp,
  IconQuestionMark,
  IconSearch,
  IconSelector,
} from '@tabler/icons-react';
import { format } from 'date-fns';
import {
  Center,
  Flex,
  Group,
  Modal,
  NavLink,
  rem,
  ScrollArea,
  Skeleton,
  Table,
  Text,
  TextInput,
  UnstyledButton,
} from '@mantine/core';
import { useInstructorDataContext } from '@/static/utils/InstructorDataContext/InstructorDataContext';
import { Exam } from '@/static/utils/InstructorDataContext/InstructorDataContextTypes';
import CreateExamModal from './CreateExamModal/CreateExamModal';
import EditExamTabs from './EditExamTabs/EditExamTabs';
import classes from './ExamTable.module.css';

// ____________________________________________________________________________________________________________

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  return format(new Date(dateString), 'PPpp'); // Example: "Sep 30, 2024, 3:45 PM"
};

function Th({
  children,
  reversed,
  sorted,
  onSort,
}: {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort: () => void;
}) {
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

export function ExamTable() {
  const { courses, selectedCourseId } = useInstructorDataContext();
  const [sortedData, setSortedData] = useState<Exam[]>([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<keyof Exam | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [currentExam, setCurrentExam] = useState<Exam>();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const selectedCourse = courses.find((course) => course.course_id === selectedCourseId);
  console.log(courses);

  // ----------------------------------------------------------------------------------------------------------

  useEffect(() => {
    if (selectedCourse) {
      setSortedData(selectedCourse.exams);
    }
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [courses, selectedCourseId]);

  // ----------------------------------------------------------------------------------------------------------

  const sortData = (
    data: Exam[],
    payload: { sortBy: keyof Exam | null; reversed: boolean; search: string }
  ) => {
    const { sortBy } = payload;
    if (!sortBy) {
      return filterData(data, payload.search);
    }
    return filterData(
      [...data].sort((a, b) => {
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

  const filterData = (data: Exam[], search: string) => {
    const query = search.toLowerCase().trim();
    return data.filter((item) =>
      Object.keys(data[0]).some((key) => {
        const value = item[key as keyof Exam];
        const stringValue = typeof value === 'string' ? value : String(value);
        return stringValue.toLowerCase().includes(query);
      })
    );
  };

  // ----------------------------------------------------------------------------------------------------------

  const setSorting = (field: keyof Exam) => {
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

  const handleRowClick = (exam: Exam) => {
    setCurrentExam(exam);
    setEditModalOpen(true);
  };

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
            placeholder="Search for exams"
            leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={3.5} />}
            value={search}
            onChange={handleSearchChange}
          />
        </div>
        <Text size="xl" fw={700}>
          {selectedCourse?.course_title} Exams
        </Text>
        <CreateExamModal questions={[]} />
      </Group>
      <ScrollArea className={classes.table}>
        <Table horizontalSpacing="md" verticalSpacing="xs" miw={700} layout="fixed" withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Th
                sorted={sortBy === 'exam_title'}
                reversed={reverseSortDirection}
                onSort={() => setSorting('exam_title')}
              >
                <Text size="lg" fw={600}>
                  Exam Title
                </Text>
              </Th>
              <Th
                sorted={sortBy === 'available_from'}
                reversed={reverseSortDirection}
                onSort={() => setSorting('available_from')}
              >
                <Text size="lg" fw={600}>
                  Available From
                </Text>
              </Th>
              <Th
                sorted={sortBy === 'available_to'}
                reversed={reverseSortDirection}
                onSort={() => setSorting('available_to')}
              >
                <Text size="lg" fw={600}>
                  Available To
                </Text>
              </Th>
            </Table.Tr>
          </Table.Thead>
          <Modal
            opened={editModalOpen}
            onClose={() => setEditModalOpen(false)} // Wrap in an arrow function
            fullScreen
          >
            <EditExamTabs
              closeModal={() => setEditModalOpen(false)}
              questions={[]}
              currentExam={currentExam}
            />
          </Modal>
          <Table.Tbody>
            {loading ? (
              Array(5)
                .fill(0)
                .map((_, index) => (
                  <Table.Tr key={index}>
                    <Table.Td>
                      <Skeleton height={30} radius="md" animate />
                    </Table.Td>
                    <Table.Td>
                      <Skeleton height={30} radius="md" animate />
                    </Table.Td>
                    <Table.Td>
                      <Skeleton height={30} radius="md" animate />
                    </Table.Td>
                  </Table.Tr>
                ))
            ) : sortedData.length > 0 ? (
              sortedData.map((row, index) => (
                <Table.Tr
                  key={index}
                  onClick={() => handleRowClick(row)}
                  className={classes.clickableRow}
                >
                  <Table.Td className={classes.td}>
                    <Text size="lg">{row.exam_title}</Text>
                  </Table.Td>
                  <Table.Td className={classes.td}>
                    <Text size="lg">{formatDate(row.available_from)}</Text>
                  </Table.Td>
                  <Table.Td className={classes.td}>
                    <Text size="lg">{formatDate(row.available_to)}</Text>
                  </Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={3}>No exams available</Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </>
  );
}
