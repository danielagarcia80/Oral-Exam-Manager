'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Card, Container, Flex, Stack, Text, Title, Image, Box, Divider, Group } from '@mantine/core';
import { useSession } from 'next-auth/react';
import { IconArrowLeft } from '@tabler/icons-react';



type Exam = {
  exam_id: string;
  title: string;
  description: string;
  type: string;
  start_date: string;
  end_date: string;
  attempts_used?: number; 
  remaining_attempts?: number;
};

type Course = {
  id: string;
  title: string;
  description: string;
  start_date: Date;
  end_date: Date;
  banner_url: string;
};

type StudentDto = {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
};


export function CourseDetails() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get('courseId');

  const { data: session, status } = useSession();
  const studentId = session?.user?.id;

  const [course, setCourse] = useState<Course | null>(null);
  const [exams, setExams] = useState<Exam[]>([]);
  const [students, setStudents] = useState<StudentDto[]>([]);

  const router = useRouter();

  const BannerImage = ({ bannerUrl }: { bannerUrl: string }) => {
    const [src, setSrc] = useState(`http://localhost:4000/${bannerUrl}`);
  
    return (

      <Image
        src={src}
        alt="Course banner"
        fit="cover"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: '100%',
        }}
        onError={() => setSrc('/default-banner.png')}
      />
     
    );
  };

  useEffect(() => {
    if (!courseId) {return;}
  
    const fetchCourse = async () => {
      try {
        const res = await fetch(`http://localhost:4000/courses/${courseId}`);
        if (!res.ok) {
          console.error('Failed to fetch course:', res.statusText);
          return;
        }
        const data = await res.json();
        setCourse(data);
      } catch (err) {
        console.error('Error fetching course:', err);
      }
    };
  
    const fetchExams = async () => {
      try {
        const res = await fetch(`http://localhost:4000/exams/course/${courseId}/student/${studentId}`);
        if (!res.ok) {
          console.error('Failed to fetch exams:', res.statusText);
          return;
        }
        const data = await res.json();
        setExams(data);
      } catch (err) {
        console.error('Error fetching exams:', err);
      }
    };
  
    const fetchStudents = async () => {
      try {
        const res = await fetch(`http://localhost:4000/courses/${courseId}/students`);
        if (!res.ok) {
          console.error('Failed to fetch students:', res.statusText);
          return;
        }
        const data = await res.json();
        setStudents(data);
      } catch (err) {
        console.error('Error fetching students:', err);
      }
    };
  
    fetchCourse();
    fetchExams();
    fetchStudents();
  }, [courseId]);
  

  if (!course) {return <Text>Loading course...</Text>;}

  const now = new Date();

  const upcomingExams = exams.filter(
    (exam) => new Date(exam.end_date) > now
  );

  const pastExams = exams.filter(
    (exam) => new Date(exam.end_date) <= now
  );


  return (
    <Container size="lg" pt="xl">
      <Group mb="md">
        <Button
          onClick={() => router.push('/dashboard')}
          leftSection={<IconArrowLeft size={16} />}
          variant="light"
        >
          Back to Dashboard
        </Button>
      </Group>

      
      <Box
        mb="lg"
        style={{
          position: 'relative',
          width: '100%',
          paddingTop: '33.33%',
          overflow: 'hidden',
          borderRadius: '12px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
        }}
      >
        <BannerImage bannerUrl={course.banner_url} />
      </Box>

      {/* Course Header Info */}
      <Title order={2} mb={4}>
        {course.title}
      </Title>
      <Text size="sm" c="dimmed" mb="md">
        {course.description || 'No description provided.'}
      </Text>

      {/* Upcoming Exams */}
      <Card shadow="md" radius="md" p="xl" withBorder mb="xl">
        <Title order={3} mb="md">Upcoming Exams</Title>
        <Divider mb="lg" />
        <Stack>
          {upcomingExams.length > 0 ? (
            upcomingExams.map((exam) => (
              <Card key={exam.exam_id} withBorder shadow="xs" p="md" radius="md">
                <Flex justify="space-between" align="flex-start" wrap="wrap">
                  <Stack gap={4} maw="75%">
                    <Title order={5}>{exam.title}</Title>
                    <Text size="sm" c="dimmed">{exam.description}</Text>
                    <Text size="sm"><strong>Type:</strong> {exam.type}</Text>
                    <Text size="sm"><strong>Start:</strong> {new Date(exam.start_date).toLocaleString()}</Text>
                    <Text size="sm"><strong>End:</strong> {new Date(exam.end_date).toLocaleString()}</Text>

                    <Text size="sm">
                      <strong>Attempts Left:</strong> {exam.remaining_attempts ?? 'N/A'}
                    </Text>

                  </Stack>
                  <Button
                    size="xs"
                    variant="light"
                    mt={{ base: 'md', sm: 0 }}
                    onClick={() => router.push(`/student/exam-setup?examId=${exam.exam_id}`)}
                  >
                    Take Exam
                  </Button>
                </Flex>
              </Card>
            ))
          ) : (
            <Text c="dimmed" ta="center">No upcoming exams.</Text>
          )}
        </Stack>
      </Card>

      {/* Past Exams */}
      <Card shadow="md" radius="md" p="xl" withBorder>
        <Title order={3} mb="md">Past Exams</Title>
        <Divider mb="lg" />
        <Stack>
          {pastExams.length > 0 ? (
            pastExams.map((exam) => (
              <Card key={exam.exam_id} withBorder shadow="xs" p="md" radius="md">
                <Stack gap={4}>
                  <Title order={5}>{exam.title}</Title>
                  <Text size="sm" c="dimmed">{exam.description}</Text>
                  <Text size="sm"><strong>Type:</strong> {exam.type}</Text>
                  <Text size="sm"><strong>Start:</strong> {new Date(exam.start_date).toLocaleString()}</Text>
                  <Text size="sm"><strong>End:</strong> {new Date(exam.end_date).toLocaleString()}</Text>
                </Stack>
              </Card>
            ))
          ) : (
            <Text c="dimmed" ta="center">No past exams.</Text>
          )}
        </Stack>
      </Card>

      <Card shadow="md" radius="md" p="xl" withBorder mt="xl">
        <Title order={3} mb="md">Enrolled Students</Title>
        <Divider mb="lg" />
        <Stack>
          {students.length > 0 ? (
            students.map((student) => (
              <Card key={student.user_id} withBorder p="md" radius="md" shadow="xs">
                <Stack gap={2}>
                  <Text fw={500}>{student.first_name} {student.last_name}</Text>
    
                </Stack>
              </Card>
            ))
          ) : (
            <Text c="dimmed" ta="center">No students enrolled yet.</Text>
          )}
        </Stack>
      </Card>

    </Container>
  );  
}


