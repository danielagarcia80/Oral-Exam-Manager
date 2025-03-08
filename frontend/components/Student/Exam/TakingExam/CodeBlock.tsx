import { ScrollArea } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeBlockProps {
    code: string;
    language?: string;
    keyword?: string;
}

// Hardcoded highlight lines and context lines
const HARD_CODED_HIGHLIGHT_LINES = [2]; // 🔴 Lines to highlight in red
const HARD_CODED_HIGHLIGHT_CONTEXT = [1, 2, 3, 4]; // 🔵 Context lines in blue

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = "java", keyword }) => {
    
    const viewportRef = useRef<HTMLDivElement>(null);
    const [highlightedLines, setHighlightedLines] = useState<string[]>([]);
    const [highlightedIndex, setHighlightedIndex] = useState<number | null>(1);

    useEffect(() => {
        handleSearch();
    }, [keyword]); 

    // Function to find keyword and highlight it
    const handleSearch = () => {
        const results = findLinesWithKeyword(code, keyword);
        setHighlightedLines(results.map(item => item.line));
        if (results.length > 0) {
            setHighlightedIndex(results[0].index);
            scrollToHighlightedLine(results[0].index);
        }
    };

    // Scroll smoothly to a highlighted line
    const scrollToHighlightedLine = (index: number) => {
        if (viewportRef.current) {
            const lineHeight = 20; // Adjust based on font size
            const position = lineHeight * (index - 2); // Offset for visibility
            viewportRef.current.scrollTo({ top: position, behavior: 'smooth' });
        }
    };

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

                    if (HARD_CODED_HIGHLIGHT_LINES.includes(actualLine)) {
                        return { style: { backgroundColor: "rgba(255, 0, 0, 0.5)", fontWeight: "bold" } }; // 🔴 Red for main highlights
                    }
                    if (HARD_CODED_HIGHLIGHT_CONTEXT.includes(actualLine)) {
                        return { style: { backgroundColor: "rgba(0, 0, 255, 0.5)" } }; // 🔵 Blue for context
                    }
                    return {};
                }}
                wrapLongLines
            >
                {code}
            </SyntaxHighlighter>
        </ScrollArea>
    );
};

// Function to find lines with a keyword
function findLinesWithKeyword(code: string, keyword?: string) {
    if (!keyword) return [];

    return code.split('\n').map((line, index) => ({ line, index }))
               .filter(item => item.line.toLowerCase().includes(keyword.toLowerCase()));
}

export default CodeBlock;
