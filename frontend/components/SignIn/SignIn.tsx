'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession, signIn, useSession } from 'next-auth/react';
import {
  Anchor,
  Button,
  Container,
  Divider,
  Group,
  Paper,
  PaperProps,
  PasswordInput,
  Select,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { upperFirst, useToggle } from '@mantine/hooks';
import { GithubButton } from './GithubButton';
import { GoogleButton } from './GoogleButton';

export default function SignIn(props: PaperProps) {
  const [type, toggle] = useToggle(['login', 'register']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push('/');
    }
  }, [session]);

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      roleType: 'STUDENT',
    },
    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val) => (val.length <= 6 ? 'Password must be at least 6 characters' : null),
    },
  });

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    if (type === 'register') {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.values.email,
          password: form.values.password,
          first_name: form.values.first_name,
          last_name: form.values.last_name,
          role: form.values.roleType,
        }),
      });

      if (res.ok) {
        await signIn('credentials', {
          email: form.values.email,
          password: form.values.password,
          redirect: false,
        });
        router.push('/');
      } else {
        const json = await res.json();
        setError(json.error || 'Registration failed');
      }
    } else {
      const result = await signIn('credentials', {
        email: form.values.email,
        password: form.values.password,
        redirect: false,
      });

      if (result?.ok) {
        const session = await getSession(); // fetch updated session
        const role = session?.user?.role;

        if (role === 'STUDENT' || role === 'INSTRUCTOR') {
          router.push('/dashboard');
        } else {
          router.push('/'); // fallback
        }
      } else {
        setError('Invalid email or password');
      }
    }

    setLoading(false);
  };

  return (
    <Container
      px={0}
      size="30rem"
      h="100vh"
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Paper radius="md" p="xl" withBorder {...props}>
        <Text size="lg" fw={500}>
          {upperFirst(type)} to OEM with
        </Text>

        <Group grow mb="md" mt="md">
          <GoogleButton onClick={() => signIn('google')}>Google</GoogleButton>
          <GithubButton onClick={() => signIn('github')}>GitHub</GithubButton>
        </Group>

        <Divider label="Or continue with email" labelPosition="center" my="lg" />

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            {type === 'register' && (
              <>
                <TextInput
                  label="First Name"
                  placeholder="Your first name"
                  value={form.values.first_name}
                  onChange={(event) => form.setFieldValue('first_name', event.currentTarget.value)}
                  radius="md"
                  required
                />
                <TextInput
                  label="Last Name"
                  placeholder="Your last name"
                  value={form.values.last_name}
                  onChange={(event) => form.setFieldValue('last_name', event.currentTarget.value)}
                  radius="md"
                  required
                />
              </>
            )}

            <TextInput
              required
              label="Email"
              placeholder="hello@example.com"
              value={form.values.email}
              onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
              error={form.errors.email}
              radius="md"
            />

            <PasswordInput
              required
              label="Password"
              placeholder="Your password"
              value={form.values.password}
              onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
              error={form.errors.password}
              radius="md"
            />

            {type === 'register' && (
              <Select
                label="Role"
                placeholder="Select role"
                data={[
                  { value: 'STUDENT', label: 'Student' },
                  { value: 'INSTRUCTOR', label: 'Instructor' },
                ]}
                value={form.values.roleType}
                onChange={(event) => {
                  if (event) {
                    form.setFieldValue('roleType', event);
                  }
                }}
                radius="md"
              />
            )}
          </Stack>

          {error && (
            <Text color="red" size="sm" mt="sm">
              {error}
            </Text>
          )}

          <Group justify="space-between" mt="xl">
            <Anchor component="button" type="button" c="dimmed" onClick={() => toggle()} size="xs">
              {type === 'register'
                ? 'Already have an account? Login'
                : "Don't have an account? Register"}
            </Anchor>
            <Button type="submit" loading={loading}>
              {upperFirst(type)}
            </Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
}
