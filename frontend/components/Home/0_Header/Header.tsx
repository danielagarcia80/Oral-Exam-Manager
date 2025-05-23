'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { Button, Container, Flex, Group, Image, Title, Anchor } from '@mantine/core';

const links = [
  { link: '/auth/signin', label: 'Login' },
  { link: '/about', label: 'About' },
];

export function Header() {
  const [active, setActive] = useState('');
  const router = useRouter();
  const { data: session, status } = useSession();
  const isLoggedIn = status === 'authenticated';

  const items = links
    .filter((link) => !(isLoggedIn && link.label === 'Login'))
    .map((link) => (
      <Anchor
        key={link.label}
        href={link.link}
        onClick={(event) => {
          event.preventDefault();
          setActive(link.link);

          if (link.label === 'About') {
            if (window.location.pathname === '/') {
              const section = document.getElementById('about');
              if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
              }
            } else {
              router.push('/#about');
            }
          } else {
            router.push(link.link);
          }
        }}
        style={{
          fontSize: '1.4rem',
          fontWeight: active === link.link ? 700 : 500,
          color: active === link.link ? '#1c7ed6' : 'black',
          textDecoration: 'none',
          padding: '8px 12px',
          borderRadius: '8px',
          backgroundColor: active === link.link ? '#e7f5ff' : 'transparent',
        }}
      >
        {link.label}
      </Anchor>
    ));

  return (
    <header style={{ padding: '20px 0', backgroundColor: '#f8f9fa' }}>
      <Container size="xl">
        <Flex justify="space-between" align="center">
          <Flex align="center" gap="md">
            <Image height={70} fit="contain" src="/Images/logo.png" alt="Logo" />
            <Title order={2} style={{ fontSize: '1.8rem' }}>
              Oral Exam Manager
            </Title>
          </Flex>

          <Group spacing="md">
            {items}
            {isLoggedIn && (
              <Button
                variant="outline"
                color="red"
                onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                style={{ fontSize: '1rem' }}
              >
                Logout
              </Button>
            )}
          </Group>
        </Flex>
      </Container>
    </header>
  );
}
