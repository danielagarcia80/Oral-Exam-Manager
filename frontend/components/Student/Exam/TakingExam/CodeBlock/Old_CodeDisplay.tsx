import { useEffect, useRef, useState } from 'react';
import { Button, Code, Flex, Highlight, ScrollArea, TextInput } from '@mantine/core';

// ____________________________________________________________________________________________________________

interface Props {
  codeFile: string;
  keyword?: string;
}

// ____________________________________________________________________________________________________________

function findLinesWithKeyword(code: string, keyword?: string) {
  if (!keyword) return [];

  return code
    .split('\n')
    .map((line, index) => ({ line, index }))
    .filter((item) => item.line.toLowerCase().includes(keyword.toLowerCase()));
}

// ____________________________________________________________________________________________________________

export default function CodeDisplay({ keyword, codeFile }: Props) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [highlightedLines, setHighlightedLines] = useState<string[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

  useEffect(() => {
    console.log(keyword);
    handleSearch(); // Run search when keyword updates
  }, [keyword]);

  // Function to update highlighted code based on keyword and scroll to the line
  const handleSearch = () => {
    const results = findLinesWithKeyword(codeFile, keyword);
    console.log(results);
    setHighlightedLines(results.map((item) => item.line));
    if (results.length > 0) {
      setHighlightedIndex(results[0].index);
      scrollToHighlightedLine(results[0].index);
    }
  };

  const scrollToHighlightedLine = (index: number) => {
    if (viewportRef.current) {
      const lineHeight = 12;
      const position = lineHeight * index;
      viewportRef.current.scrollTo({ top: position, behavior: 'smooth' });
    }
  };

  return (
    <>
      <ScrollArea
        style={{
          marginLeft: '4%',
          marginTop: '2%',
          marginBottom: '2%',
          height: 420,
          width: 1200,
        }}
        viewportRef={viewportRef}
      >
        <Code block>
          {codeFile.split('\n').map((line, index) => (
            <div
              key={index}
              style={highlightedIndex === index ? { backgroundColor: 'lightBlue' } : undefined}
            >
              {line}
            </div>
          ))}
        </Code>
      </ScrollArea>
    </>
  );
}
