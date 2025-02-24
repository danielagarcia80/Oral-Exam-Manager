'use client';

import { useEffect, useState } from 'react';
import { Button, Input, Space, Text, Title, Loader, List } from '@mantine/core';
import classes from './Welcome.module.css';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';


interface Test {
  id: number;
  email: string;
  name: string;
}

export function Welcome() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(false);
  const [laodindTests, setLoadingTests] = useState(true);
  const [error, setError] = useState('');
  const { data: session } = useSession();
  const router = useRouter();


  useEffect(() => {
    if (!session) {
      router.push('/auth/signin');
    }
  }, [session]);

  const fetchTests = async () => {
    setLoadingTests(true);
    try {
      const response = await fetch('http://localhost:4000/test');
      if (!response.ok) { throw new Error('Failed to fetch tests'); }
      const data = await response.json();
      setTests(data);
    } catch (err) {
      setError('Error fetching tests');
    } finally {
      setLoadingTests(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const createTest = async () => {
    if (!email || !name) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:4000/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name }),
      });

      if (!response.ok) { throw new Error('Failed to create test'); }

      setEmail('');
      setName('');
      fetchTests();
    } catch (err) {
      setError('Error creating test');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Title className={classes.title} ta="center" mt={100}>
        Welcome to{' '}
        <Text inherit variant="gradient" component="span" gradient={{ from: 'pink', to: 'yellow' }}>
          RNA3DS LAB
        </Text>
      </Title>

      <Text ta="center" mt={10}>
        Hello {session?.user?.name}, please submit your test
      </Text>


      <center>
      <Button onClick={() => signOut()}>Sign Out</Button>
        <Input.Wrapper w={250} label="Email">
          <Input type='email' placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </Input.Wrapper>

        <Input.Wrapper w={250} label="Name">
          <Input type='text' placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} />
        </Input.Wrapper>

        <Space h={10} />

        <Button variant="gradient" gradient={{ from: 'green', to: 'red' }} onClick={createTest} disabled={loading}>
          {loading ? <Loader size="sm" /> : 'Submit'}
        </Button>

        {error && <Text color="red">{error}</Text>}

        <Title order={3} mt={30}>Submitted Tests</Title>
        {laodindTests && <Loader size="sm" />}

        <List spacing="xs">
          {tests.map((test, index) => (
            <List.Item key={index}>{test.name} ({test.email})</List.Item>
          ))}
        </List>
      </center>
    </>
  );
}
