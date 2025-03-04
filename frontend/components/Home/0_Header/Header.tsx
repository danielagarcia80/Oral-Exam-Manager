import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Container, Flex, Group, Image } from '@mantine/core';
import classes from './Header.module.css';

const links = [
  { link: '/login', label: 'Login' },
  { link: '/about', label: 'About' },
];

export function Header() {
  const [active, setActive] = useState(links[0].link);
  const router = useRouter();
  
  const items = links.map((link) => (
    <a
      key={link.label}
      href={link.link}
      className={classes.link}
      data-active={active === link.link || undefined}
      onClick={(event) => {
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
      <Flex align="center"> {/* Align items vertically */}
          <Image
            radius="md"
            height="50"
            width="auto"
            fit="contain"
            src="/Images/logo.png" // Correct path referencing the public directory
          />
          <span style={{ marginLeft: '10px' }}> {/* Optional: add spacing between the logo and text */}
            Code Oriented Oral Exam Manager
          </span>
        </Flex>
        <Group justify="space-between" h="100%" grow>
          {items}
        </Group>
      </Container>
    </header>
  );
}