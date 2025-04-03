'use client';

/**
 * @author Shaun Rose <srose@csumb.edu>
 * @description The instructor dashboard is the main interface the instructor uses to manage exams. 
 *              It is loaded in the instructor-dashboard.tsx page. 
 */

// ____________________________________________________________________________________________________________
/**
 * Imports
 */

import React, { useState } from 'react';
import NavTabs from './Tabs/NavTabs';
import { Divider, Flex } from '@mantine/core';
import { DashboardHeader } from './DashboardHeader/DashboardHeader';
import SideNavbar from './DashboardNavbar/SideNavbar';
import { InstructorDataProvider } from '@/static/utils/InstructorDataContext/InstructorDataContext';

// ____________________________________________________________________________________________________________
/**
 * The exams interface is a datatype defined to store exam data from the api and pass it into the 
 * tabs->examTable as a prop.
 * 
*/

interface Exams {
  exam_id: number;
  exam_title: string;
  exam_instructions: string;
  available_from: string;
  available_to: string;
  access_code: string;
}

interface Questions {
  question_id: number;
  question_title: string;
  question_type: string;
  question_content: string;
}

// ____________________________________________________________________________________________________________
/**
 * The instructor dashboard component is the main screen the instructor will use when managing courses and exams.
 * It's the parent component of the Header, Tabs, and Navbar.
 * @function Canvas {JSX.Element}
 * @returns {JSX.Element}
 */

const InstructorDashboard: React.FC = () => {
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<number | undefined>(undefined);
  const [selectedCourseTitle, setSelectedCourseTitle] = useState<string | undefined>(undefined);
  const [exams, setExams] = useState<Exams[]>([]);
  const [questions, setQuestions] = useState<Questions[]>([]);

  const handleCourseSelect = (label: string) => {
    setSelectedCourse(label === '' ? undefined : parseInt(label, 10));
  };
  return (
    <>
      <InstructorDataProvider>
        {/* <DashboardHeader /> */}
        <Flex style={{marginTop: "20px"}}>
          <div>
            <span style={{ display: "block", height: "37px" }}></span>
            <Divider />
            <SideNavbar
            />
          </div>
          <div>
            <NavTabs
              courseId={selectedCourse}
              course={selectedCourseTitle}
              exams={exams}
              questions={questions}
            />
          </div>
        </Flex>
      </InstructorDataProvider>
    </>
  );
};


export default InstructorDashboard;
