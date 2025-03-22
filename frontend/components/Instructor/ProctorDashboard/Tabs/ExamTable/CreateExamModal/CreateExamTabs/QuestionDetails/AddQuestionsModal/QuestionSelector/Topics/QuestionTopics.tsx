
// ____________________________________________________________________________________________________________

import { useState } from 'react';
import { ScrollArea } from '@mantine/core';
import { IconBook, } from '@tabler/icons-react';
import classes from "./QuestionTopics.module.css"

// ____________________________________________________________________________________________________________

const data = [
  { link: '', label: 'MIPS - Stack', icon: IconBook },
  { link: '', label: 'MIPS - Floating Point', icon: IconBook },
  { link: '', label: 'HDL - Multiplexer', icon: IconBook },
  { link: '', label: 'HDL - RAM', icon: IconBook },
  { link: '', label: 'CPU - Diagram', icon: IconBook },
];

// ____________________________________________________________________________________________________________

export function QuestionTopics() {
  const [active, setActive] = useState(data[0].label);  
  const links = data.map((item) => (
    <a
      className={classes.link}
      data-active={item.label === active || undefined}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.label);
      }}
    >
      <span>{item.label}</span>
    </a>
  ));
  return (
    <>
    <ScrollArea>
      {links}
    </ScrollArea>
    </>
  );
}