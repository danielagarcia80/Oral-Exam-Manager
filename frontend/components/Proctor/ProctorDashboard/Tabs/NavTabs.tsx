/**
 * @author Shaun Rose <shaunrose@gmail.com, 831-710-8120>
 */

// ____________________________________________________________________________________________________________

import React from 'react';
import { IconArticle, IconQuestionMark, IconUsers } from '@tabler/icons-react';
import { rem, Tabs, Text } from '@mantine/core';
import { useInstructorDataContext } from '@/static/utils/InstructorDataContext/InstructorDataContext';
import { ExamTable } from './ExamTable/ExamTable';
import { QuestionTableCopy } from './QuestionTable/QuestionTable';
import classes from './NavTabs.module.css';

// ____________________________________________________________________________________________________________
/**
 * Defined data types for the props, these allow us to recieve the course title string and exams from the
 * instructor dashboard parent component.
 */
interface ExamData {
  exam_id: number;
  exam_title: string;
  exam_instructions: string;
  available_from: string;
  available_to: string;
  access_code: string;
}

interface ExamTableProps {
  courseId: number | undefined;
  course: string | undefined;
  exams: ExamData[];
  questions: Questions[];
}

interface Questions {
  question_id: number;
  question_title: string;
  question_type: string;
  question_content: string;
}

// ____________________________________________________________________________________________________________
/**
 * The NavTabs component is displayed in the instrucor dashboard and allows the instructor to
 * select between exams, questions, and students in the course that's selected in the SideNavbar component.
 * @function Canvas {JSX.Element}
 * @returns {JSX.Element}
 */

export default function NavTabs({ courseId, course, exams, questions }: ExamTableProps) {
  const iconStyle = { width: rem(18), height: rem(18) };
  const { courses, selectedCourseId } = useInstructorDataContext();
  const selectedCourse = courses.find(
    (course: { course_id: any }) => course.course_id === selectedCourseId
  );

  return (
    <>
      <Tabs variant="outline" radius="md" defaultValue="exams">
        <Tabs.List grow justify="center">
          <Tabs.Tab
            value="exams"
            className={classes.tab}
            leftSection={<IconArticle style={iconStyle} />}
            style={{ fontSize: '18px' }}
          >
            Exams
          </Tabs.Tab>
          <Tabs.Tab
            value="questions"
            className={classes.tab}
            leftSection={<IconQuestionMark style={iconStyle} />}
            style={{ fontSize: '18px' }}
          >
            Questions
          </Tabs.Tab>
          <Tabs.Tab
            value="students"
            className={classes.tab}
            leftSection={<IconUsers style={iconStyle} />}
            style={{ fontSize: '18px' }}
          >
            Students
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="exams">
          <ExamTable />
        </Tabs.Panel>
        <Tabs.Panel value="questions">
          <QuestionTableCopy />
        </Tabs.Panel>
        <Tabs.Panel value="students">hello</Tabs.Panel>
      </Tabs>
    </>
  );
}
