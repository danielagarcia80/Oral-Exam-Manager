import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
  Divider
} from '@mantine/core';
import { GoogleButton } from './GoogleButton';
import { useState } from 'react';
import { useRouter } from 'next/router';

import classes from './LoginForm.module.css';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter(); // Initialize the router

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement your login logic here
    console.log("You entered: ", email, password);
    router.push('instructor-dashboard');
  };

  const handleGoogleSuccess = (response: any) => {
    console.log("You entered: ", email, password);
    router.push('exam-start');
  };

  const handleGoogleFailure = (error: any) => {
    // Handle Google login failure
    console.error(error);
  };

  return (
    <>
    <Container size={420} my={40}>    
      {/* <Title ta="center" className={classes.title}>
        Verbal Exam Manager
      </Title> */}
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <Text size="lg" fw={500} ta="center" style={{padding: '20px'}}>
          Login
        </Text>
        <Text size="lg" fw={500} ta="center" style={{padding: '20px'}}>
          Student or Instructor
        </Text>
        <TextInput label="Email" placeholder="YourEmail@csumb.edu" required />
        <PasswordInput label="Password" placeholder="Your password" required mt="md" />
        <Group justify="space-between" mt="lg">
          <Checkbox label="Remember me" />
          <Anchor component="button" size="sm">
            Forgot password?
          </Anchor>
        </Group>
        <Button fullWidth mt="xl" onClick={handleLogin}>
          Sign in
        </Button>
        <Divider label="Or" labelPosition="center" my="lg" />
        <Group grow mb="md" mt="md">
          <GoogleButton radius="xl" onClick={handleGoogleSuccess}>Login with Google</GoogleButton>
        </Group>
        
      </Paper>
    
    </Container>
    </>
  );
};

export default LoginForm;