import { ScrollArea } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useExam } from "../../ExamDataProvider";

export default function CodeBlock () {
    const viewportRef = useRef<HTMLDivElement>(null);
    const [highlightedLines, setHighlightedLines] = useState<number[]>([]);
    const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
    const fileString = useExam().fileString;
    const currentQuestion = useExam().currentQuestion;
    const language = useExam().examLanguage;

    useEffect(() => {
        handleSearch();
    }, [currentQuestion?.keywords]); 

    const handleSearch = () => {
        if (!currentQuestion?.keywords[0]) {
            setHighlightedLines([]);
            setHighlightedIndex(null);
            return;
        }
        const results = findLinesWithKeyword(fileString, currentQuestion.keywords[0].keyword);
        const lineIndices = results.map(item => item.index);
        setHighlightedLines(lineIndices);
        if (lineIndices.length > 0) {
            setHighlightedIndex(lineIndices[0]);
            scrollToHighlightedLine(lineIndices[0]);
        }
    };

    const scrollToHighlightedLine = (index: number) => {
        if (viewportRef.current) {
            const lineHeight = 20; // Adjust based on font size
            const position = lineHeight * (index - 2); // Offset for visibility
            viewportRef.current.scrollTo({ top: position, behavior: 'smooth' });
        }
    };

    const scrollToLine = (lineIndex: number) => {
        if (viewportRef.current) {
                const lineHeight = 20;
                const position = lineHeight * lineIndex;
                viewportRef.current.scrollTop = position - (viewportRef.current.offsetHeight / 2);
        }
    };

    function findLinesWithKeyword(code: string, keyword?: string) {
        if (!keyword) return [];
        return code.split('\n').map((line, index) => ({ line, index }))
                   .filter(item => item.line.toLowerCase().includes(keyword.toLowerCase()));
    }

    return (
        <ScrollArea
            style={{
                marginLeft: "2%",
                marginRight: "2%",
                marginTop: "1%",
                marginBottom: "1%",
                height: 700,
                width: "96%"
            }}
            viewportRef={viewportRef}
        >                   
            <SyntaxHighlighter
                language={language}
                style={atomDark}
                showLineNumbers
                wrapLines
                lineProps={(lineNumber) => {
                    const actualLine = lineNumber - 1; // Adjust for zero-based indexing
                    if (highlightedLines.includes(actualLine)) {
                        return { style: { backgroundColor: "rgba(255, 0, 0, 0.5)", fontWeight: "bold" } }; // 🔵 Highlighted keyword lines
                    }
                    return {};
                }}
                wrapLongLines
            >
                {fileString}
            </SyntaxHighlighter>
        </ScrollArea>
    );
};