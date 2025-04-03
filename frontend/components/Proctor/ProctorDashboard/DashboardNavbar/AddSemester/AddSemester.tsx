import { useEffect, useState } from 'react';
import { IconDeviceFloppy, IconTrash } from '@tabler/icons-react';
import { Button, Divider, Group, Select } from '@mantine/core';
import { YearPickerInput } from '@mantine/dates';
import classes from './AddSemester.module.css';

interface Props {
  closeModal: () => void;
}

const AddSemesterModal: React.FC<Props> = ({ closeModal }) => {
  const [date, setDate] = useState(new Date());
  const [semester, setSemester] = useState<string>('Fall');
  const [previousSemesterCourses, setPreviousSemesterCourses] = useState<string[]>([]);
  const [teachersIds, setTeachersIds] = useState<string[]>([]);

  useEffect(() => {
    const month = date.getMonth();
    let season: string = 'Fall'; // Default to Fall
    if (month < 3) {
      season = 'Winter';
    } else if (month < 6) {
      season = 'Spring';
    } else if (month < 9) {
      season = 'Summer';
    }
    setSemester(season);
  }, [date]);

  const handleSemesterChange = (value: string | null) => {
    if (value) setSemester(value);
  };

  const handleDateChange = (value: Date | null) => {
    if (value) setDate(value);
  };

  const handleAddSemester = async () => {
    try {
      // Fetch the highest semester_id value
      const response = await fetch('http://localhost:3001/semesters');
      const semesters = await response.json();

      // Calculate the semester season and year for the new semester based on dropdown selections
      const nextSemesterSeason = semester; // Use selected semester season
      const nextSemesterYear = date.getFullYear(); // Use selected year

      // Find the highest semester_id and increment by 1
      const highestSemesterId = Math.max(
        ...semesters.map((semester: any) => parseInt(semester.semester_id, 10))
      );
      const nextSemesterId = highestSemesterId + 1;

      // Add the new semester to the database
      const addSemesterResponse = await fetch('http://localhost:3001/semesters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          semester_season: nextSemesterSeason,
          semester_year: nextSemesterYear,
          semester_id: nextSemesterId,
        }),
      });

      if (addSemesterResponse.ok) {
        // Fetch courses from the previous semester
        const coursesResponse = await fetch(
          `http://localhost:3001/courses/previous-semester/${highestSemesterId}`
        );
        const courses = await coursesResponse.json();
        console.log('addsemester:', courses);
        setPreviousSemesterCourses(courses);

        // Fetch teachers from the previous semester
        const teachersResponse = await fetch(
          `http://localhost:3001/teachers/previous-semester/${highestSemesterId}`
        );
        const teachers = await teachersResponse.json();
        console.log('addsemester:', teachers);
        setTeachersIds(teachers.map((teacher: any) => teacher.id));

        // Close modal after successful creation
        closeModal();
      } else {
        console.error('Error adding semester:', addSemesterResponse.statusText);
      }
    } catch (error) {
      console.error('Error adding semester:', error);
      // Handle error
    }
  };

  return (
    <>
      <Select
        label="Semester Season"
        data={['Fall', 'Spring', 'Summer', 'Winter']}
        value={semester}
        onChange={handleSemesterChange}
        allowDeselect={false}
        className={classes.item}
      />
      <YearPickerInput
        label="Pick date"
        placeholder="Pick date"
        value={date}
        onChange={handleDateChange}
        className={classes.item}
      />
      <Divider style={{ marginTop: '10%' }} />
      <Group justify="center" mt="md">
        <Button
          color="red"
          type="button"
          leftSection={<IconTrash />}
          style={{ margin: '5%' }}
          onClick={closeModal}
        >
          Cancel
        </Button>
        <Button
          color="green"
          type="submit"
          leftSection={<IconDeviceFloppy />}
          style={{ margin: '5%' }}
          onClick={handleAddSemester}
        >
          Add Semester
        </Button>
      </Group>
    </>
  );
};

export default AddSemesterModal;
