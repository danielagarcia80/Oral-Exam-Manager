import { Box, Group, TextInput, Button, Divider } from "@mantine/core";
import { useForm } from '@mantine/form';
import { IconDeviceFloppy, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import classes from './AddCourse.module.css';
import { fetchStudentsFromCanvas, handleStudentData, fetchCoursesFromCanvas, studentsRow } from "@/api/instructor/instructorAPIs";

// Define a type for the form values
interface FormValues {
  course_number: string;
  course_title: string;
  course_section: string;
  course_id: string;  // Canvas course ID
  canvas_authentication_token: string;  // Canvas API token
}

interface ModalContentProps {
  closeModal: () => void;
  semester_id: number | undefined;
}

const AddCourse: React.FC<ModalContentProps> = ({ closeModal, semester_id }) => {
  const handleCancel = () => {
    if (modifiedForm === true) {
      openMessageModal();
    } else {
      closeModal();
    }
  };

  const [studentData, setStudentData] = useState<studentsRow[]>([]);

  const closeForm = () => {
    form.reset();
    close();
  }

  const [openedMessageModal, setMessageOpened] = useState(false);
  const openMessageModal = () => setMessageOpened(true);
  const closeMessageModal = () => setMessageOpened(false);

  const [modifiedForm, setModified] = useState(false);
  const notModified = () => setModified(false);
  const modified = () => setModified(true);

  const form = useForm<FormValues>({
    initialValues: {
      course_number: '',
      course_title: '',
      course_section: '',
      course_id: '',  // Initialize course ID field
      canvas_authentication_token: ''  // Initialize Canvas token field
    },

    validate: {

    },
  });

  const submitCourse = async (values: FormValues) => {
    if (semester_id === undefined) {
      console.error("No semester ID provided.");
      return;
    }
    console.log(values)
    try {
      // API call to create the course
      const courseResponse = await fetch('http://localhost:3001/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          course_title: values.course_title,
          course_number: values.course_number,
          course_section: values.course_section,
          semester_id: semester_id,  // Include semester_id in the request
        }),
      });

      if (courseResponse.ok) {
        const courseData = await courseResponse.json();
        console.log('Course created successfully with ID:', courseData.courseId);

        // Retrieve students from Canvas
        const students = await fetchStudentsFromCanvas(values.course_id, values.canvas_authentication_token);
        if (students) {
          setStudentData(students);
          console.log(students);
          console.log(courseData)
          if (students.length > 0) {
            await handleStudentData(courseData.course_id, students);
          } else {
            console.log('No students to add.');
          }
        }

        closeModal(); // Close modal on successful creation
      } else {
        const errorData = await courseResponse.json();
        throw new Error('Failed to create course: ' + errorData.message);
      }
    } catch (error) {
      console.error('Error submitting course:', error);
    }
  };

  return (
    <>
      <Box maw={800} mx="auto">
        <form onChange={modified}
          onSubmit={form.onSubmit(submitCourse)}
        >
          <TextInput
            withAsterisk
            label="Course Number"
            placeholder="CST370"
            {...form.getInputProps('course_number')}
            className={classes.inner}
          />
          <TextInput
            withAsterisk
            label="Course Title"
            placeholder="Algorithms"
            {...form.getInputProps('course_title')}
            className={classes.inner}
          />
          <TextInput
            withAsterisk
            label="Course Section"
            placeholder="01"
            {...form.getInputProps('course_section')}
            className={classes.inner}
          />
          <TextInput
            withAsterisk
            label="Course ID"
            placeholder="(5-digit number found in the course home url)"
            {...form.getInputProps('course_id')}
            className={classes.inner}
          />
          <TextInput
            withAsterisk
            label="Canvas Authentication Token"
            placeholder="(Account -> Settings -> Create Token)"
            {...form.getInputProps('canvas_authentication_token')}
            className={classes.inner}
          />
          <Divider style={{ marginTop: "5%" }} />
          <Group justify="center" mt="md">
            <Button
              color="red"
              type="button"
              onClick={handleCancel}
              leftSection={<IconTrash />}
              style={{ margin: "5%" }}
            >
              Cancel
            </Button>
            <Button
              color="green"
              type="submit"
              leftSection={<IconDeviceFloppy />}
              style={{ margin: "5%" }}
            >
              Add Course
            </Button>
            <Button
              color="green"
              onClick={() => fetchCoursesFromCanvas(form.values.canvas_authentication_token)}
            >
              Fetch Courses
            </Button>
          </Group>
        </form>
      </Box>
    </>
  );
}

export default AddCourse;
