import { useState, useEffect, useContext } from 'react';
import { Divider, Flex, Select, Space, Title, Modal, Button } from '@mantine/core';
import { IconSwitchHorizontal, IconLogout, IconChalkboard, IconPlus, IconTrash } from '@tabler/icons-react';
import React from 'react';
import classes from './SideNavbar.module.css';
import AddSemesterModal from './AddSemester/AddSemester';
import AddCourse from './AddCourse/AddCourse';
import { useInstructorDataContext } from '@/static/utils/InstructorDataContext/InstructorDataContext';
import { Semester } from '@/static/utils/InstructorDataContext/InstructorDataContextTypes';
import { fetchSemestersAPI, fetchCoursesExamsQuestionsAPI, deleteCourseAPI } from '@/api/instructor/instructorAPIs';
import GoogleSignInButton from '@/components/Home/Login/GoogleSignInButton';

const SideNavbar: React.FC = () => {
  const { setCourses, setSelectedCourseId, courses, selectedCourseId } = useInstructorDataContext();
  const [selectedSemester, setSelectedSemester] = useState<Semester | null>(null);
  const [selectedSemesterId, setSelectedSemesterId] = useState<number | undefined>();
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [opened, setOpened] = useState(false);
  const [semesterModalOpened, setSemesterModalOpened] = useState(false);

  useEffect(() => {
    fetchSemesters();
  }, []);

  const fetchSemesters = async () => {
    const data = await fetchSemestersAPI();
    const sortedSemesters = data.sort((a: Semester, b: Semester) => {
      const keyA = getSortableKey(a.label);
      const keyB = getSortableKey(b.label);
      if (keyA.year !== keyB.year) return keyB.year - keyA.year;
      return keyA.season - keyB.season;
    });

    const semestersWithAddNew = [
      ...sortedSemesters,
      { group: ' ', items: [{ value: 'add-new', label: 'Add New Semester' }] }
    ];
    setSemesters(semestersWithAddNew);

    if (sortedSemesters.length > 0) {
      setSelectedSemester(sortedSemesters[0]);
      setSelectedSemesterId(sortedSemesters[0].value);
      fetchCoursesExamsQuestions(sortedSemesters[0].value);
    }
  };

  const getSortableKey = (label: string) => {
    const parts = label.match(/(\D+)\s+(\d+)/);
    if (!parts) return { year: 0, season: 0 };

    const seasonWeight: Record<string, number> = {
      'Spring': 1,
      'Summer': 2,
      'Fall': 3,
      'Winter': 4
    };
    return {
      year: parseInt(parts[2], 10),
      season: seasonWeight[parts[1]] || 0
    };
  };

  const handleSemesterChange = async (value: string | null) => {
    if (value) {
      if (value === 'add-new') {
        setSemesterModalOpened(true);
      } else {
        setSelectedSemester(semesters.find(semester => semester.value === value) || null);
        setSelectedCourseId(null);
        fetchCoursesExamsQuestions(value);
      }
    }
  };

  const fetchCoursesExamsQuestions = async (semesterId: string) => {
    const data = await fetchCoursesExamsQuestionsAPI(semesterId);
    setCourses(data);
    if (data.length > 0) {
      setSelectedCourseId(data[0].course_id);
    }
  };

  const selectCourse = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, courseId: number, courseTitle: string) => {
    event.preventDefault();
    setSelectedCourseId(courseId);
  };

  const deleteCourse = async (courseId: number) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      const success = await deleteCourseAPI(courseId);
      if (success) {
        setCourses(courses.filter(course => course.course_id !== courseId));
        setSelectedCourseId(null);
      }
    }
  };

  return (
    <>
      <nav className={classes.navbar}>
        <div className={classes.navbarMain}>
          
        <GoogleSignInButton/>
          <Flex justify='space-between'>
            {/* here */}
            
            <Title size="1.5rem" className={classes.header}>
              Semester:
            </Title>
          </Flex>
          <Select
            size="lg"
            data={semesters}
            value={selectedSemester?.value}
            onChange={handleSemesterChange}
            allowDeselect={false}
            className={classes.navbarSelect}
          />
          <Modal
            opened={semesterModalOpened}
            onClose={() => setSemesterModalOpened(false)}
            title="Adding New Semester"
          >
            <AddSemesterModal closeModal={() => setSemesterModalOpened(false)} />
          </Modal>
          <Space h="md" />
          <Divider />
          <Space h="md" />
          <Flex justify='space-between'>
            <Title size="1.5rem" className={classes.header}>
              Courses:
            </Title>
          </Flex>
          {courses.map(course => (
            <div key={course.course_id} className={classes.courseContainer}>
              <a
                className={classes.link}
                data-active={course.course_id === selectedCourseId || undefined}
                href=""
                onClick={event => selectCourse(event, course.course_id, course.course_title)}
              >
                <Flex>
                  <IconChalkboard stroke={2.5} style={{ marginRight: "20px" }} />
                  <span style={{ fontSize: "15px", width: "150px" }}>{course.course_title}</span>
                  <Button variant="subtle" onClick={() => deleteCourse(course.course_id)}>
                    <IconTrash size={16} />
                  </Button>
                </Flex>
              </a>
            </div>
          ))}
          <Modal
            opened={opened}
            onClose={() => setOpened(false)}
            title="Adding a course:"
          >
            <AddCourse semester_id={selectedSemesterId} closeModal={() => setOpened(false)} />
          </Modal>
          <a
            className={classes.link}
            onClick={() => setOpened(true)}
          >
            <IconPlus stroke={2.5} style={{ marginRight: "20px" }} />
            <span style={{ fontSize: "15px" }}>Create a new course</span>
          </a>
        </div>
        <div className={classes.footer}>
          <a href="#" className={classes.link} onClick={event => event.preventDefault()}>
            <IconSwitchHorizontal className={classes.linkIcon} stroke={1.5} />
            <span>Change account</span>
          </a>
          <a href="#" className={classes.link} onClick={event => event.preventDefault()}>
            <IconLogout className={classes.linkIcon} stroke={1.5} />
            <span>Logout</span>
          </a>
          
        </div>
      </nav>
    </>
  );
};

export default SideNavbar;
