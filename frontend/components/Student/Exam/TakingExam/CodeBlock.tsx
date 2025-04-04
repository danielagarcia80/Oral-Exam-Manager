import { useEffect, useRef, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ScrollArea } from '@mantine/core';
import { useExam } from '../ExamDataProvider';

interface CodeBlockProps {
  code: string;
  language?: string;
  highlightLines?: number[];
  highlightContext?: number[];
  keyword?: string;
}

function findLinesWithKeyword(code: string, keyword?: string) {
  if (!keyword) return [];

  return code
    .split('\n')
    .map((line, index) => ({ line, index }))
    .filter((item) => item.line.toLowerCase().includes(keyword.toLowerCase()));
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'java',
  highlightLines = [],
  highlightContext = [],
  keyword,
}) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [highlightedLines, setHighlightedLines] = useState<string[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

  useEffect(() => {
    handleSearch();
  }, [keyword]);

  // Function to update highlighted code based on keyword and scroll to the line
  const handleSearch = () => {
    const results = findLinesWithKeyword(code, keyword);
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
    <ScrollArea
      style={{
        marginLeft: '2%',
        marginRight: '2%',
        marginTop: '1%',
        marginBottom: '1%',
        height: 700,
        width: '96%',
      }}
      viewportRef={viewportRef}
    >
      <SyntaxHighlighter
        language={language}
        style={atomDark}
        showLineNumbers
        wrapLines
        lineProps={(lineNumber) => {
          // Check if the current lineNumber is in the highlightLines array
          if (highlightLines.includes(lineNumber)) {
            return { style: { backgroundColor: 'rgba(255, 0, 0, 0.5)', fontWeight: 'bold' } }; // 🔴 Red for main highlights
          }
          // Check if the current lineNumber is in the highlightContext array
          if (highlightContext.includes(lineNumber)) {
            return { style: { backgroundColor: 'rgba(0, 0, 255, 0.5)' } }; // Blue for context
          }
          return {};
        }}
      >
        {code}
      </SyntaxHighlighter>
    </ScrollArea>
  );
};

export default CodeBlock;
