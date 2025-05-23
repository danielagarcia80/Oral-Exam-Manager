/**
 * @author Shaun Rose <thefrznrose@gmail.com>
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Group, Image } from '@mantine/core';
import classes from './Header.module.css';

// -----------------------------------------------------------------------------------------------------------

const links = [
  { link: '/', label: 'Home' },
  // { link: '/login', label: 'Login' },
  // { link: '/about', label: 'About' },
];

// -----------------------------------------------------------------------------------------------------------

export function DashboardHeader() {
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
      {/* <Container size="xl" className={classes.inner}> */}
      {/* <Image
          radius="md"
          height="50"
          width="auto"
          fit="contain"
          src="/csmb-logo.svg" // Correct path referencing the public directory
        /> */}
      {/* <Group justify="space-between" h="100%" grow>
          {items}
        </Group> */}
      {/* </Container> */}
    </header>
  );
}
