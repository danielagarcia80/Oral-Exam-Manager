'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { Button, Container, Flex, Group, Image } from '@mantine/core';
import classes from './Header.module.css';

const links = [
  { link: '/auth/signin', label: 'Login' },
  { link: '/about', label: 'About' },
];

export function Header() {
  const [active, setActive] = useState(links[0].link);
  const router = useRouter();
  const { data: session, status } = useSession();
  const isLoggedIn = status === 'authenticated';

  const items = links.map((link) => (
    <a
      key={link.label}
      href={link.link}
      className={classes.link}
      data-active={active === link.link || undefined}
      onClick={(event) => {
        event.preventDefault(); // Prevent default anchor behavior
        setActive(link.link);
        router.push(link.link);
      }}
    >
      {link.label}
    </a>
  ));

  return (
    <header className={classes.header}>
      <Container size="xl" className={classes.inner}>
        <Flex align="center">
          <Image radius="md" height="50" width="auto" fit="contain" src="/Images/logo.png" />
          <span style={{ marginLeft: '10px' }}>Code Oriented Oral Exam Manager</span>
        </Flex>

        <Group justify="space-between" h="100%" grow>
          {items}
          {isLoggedIn && (
            <Button
              variant="outline"
              color="red"
              onClick={() => signOut({ callbackUrl: '/auth/signin' })}
            >
              Logout
            </Button>
          )}
        </Group>
      </Container>
    </header>
  );
}
