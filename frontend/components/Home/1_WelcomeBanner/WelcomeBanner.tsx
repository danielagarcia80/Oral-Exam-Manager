'use client'; // Ensures this is a Client Component

import { Title, Text, Button, Image } from '@mantine/core';
import classes from './WelcomeBanner.module.css';
import { useRouter } from "next/navigation";
import { IconDeviceTvOld, IconLogin2, IconUser } from '@tabler/icons-react';

export function Welcome() {
  const router = useRouter();

  const handleExamStart = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/student/demo-exam-setup');
  };

  const handleOpenDashboard = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/proctor/instructor-dashboard');
  };

  return (
    <>
      <Title className={classes.title} ta="center" mt={100} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Image
          style={{ width: '300px', height: '300px' }} // Adjust size here
          src={'/Images/logo.png'}
        />
        <Text inherit variant="gradient" component="span" gradient={{ from: 'Blue', to: 'Gold' }}>
          Code Oriented Oral Exam Manager
        </Text>
      </Title>
      <Text className={classes.instructions} ta="center">
        The world's #1 programming assessment platform.
        -Sameer
      </Text>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', gap: '20px' }}>
        <Button 
          size="xl" 
          className={classes.Button} 
          onClick={handleExamStart} 
          leftSection={<IconLogin2 size={34} />}
          style={{ width: '15%' }}  
        >
          Try Demo
        </Button>
        <Button 
          size="xl" 
          className={classes.Button} 
          onClick={handleOpenDashboard} 
          leftSection={<IconUser size={34} />}
          style={{ width: '15%' }} 
        >
          Login
        </Button>
      </div>
    </>
  );
}
