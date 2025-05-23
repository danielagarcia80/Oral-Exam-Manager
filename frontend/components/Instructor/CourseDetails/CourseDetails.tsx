'use client';

import { useState } from 'react';
import { HeaderSection } from './0_Header/HeaderSection';
import { TabNavigation } from './1_TabNavigation/TabNavigation';
import { ExamsSection } from './2_Sections/ExamsSection';
import { QuestionBankSection } from './2_Sections/QuestionBankSection';
import { StudentsSection } from './2_Sections/StudentsSection';
import { GradesSection } from './2_Sections/GradesSection';
import { Button, Container, Group } from '@mantine/core';
import { useRouter, useSearchParams } from 'next/navigation';
import { IconArrowLeft } from '@tabler/icons-react';

export default function CourseDetails() {
  const [activeTab, setActiveTab] = useState<'exams' | 'question_bank' | 'students' | 'grades'>('exams');
  const searchParams = useSearchParams();
  const courseId = searchParams.get('courseId');
  const router = useRouter();

  return (
    <Container size="lg" mt="md">
      <Group mb="md">
        <Button
          onClick={() => router.push('/dashboard')}
          leftSection={<IconArrowLeft size={16} />}
          variant="light"
        >
          Back to Dashboard
        </Button>
      </Group>

      <HeaderSection courseId={courseId as string}/>

      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'exams' && <ExamsSection />}
      {activeTab === 'question_bank' && <QuestionBankSection />}
      {activeTab === 'students' && <StudentsSection />}
      {activeTab === 'grades' && <GradesSection />}
    </Container>
  );
}
