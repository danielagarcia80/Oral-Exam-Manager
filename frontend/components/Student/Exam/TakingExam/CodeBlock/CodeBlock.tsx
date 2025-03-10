import { ScrollArea } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useExam } from "../../ExamDataProvider";

export default function CodeBlock() {
    const viewportRef = useRef<HTMLDivElement>(null);
    const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
    const [highlightedContext, setHighlightedContext] = useState<number[]>([]);
    const fileString = useExam().fileString || ""; // Ensure it's not undefined
    const currentQuestion = useExam().currentQuestion;
    const currentQuestionIndex = useExam().currentQuestionIndex;
    const language = useExam().examLanguage || "plaintext"; // Default language

    useEffect(() => {
        handleQuestionChange();
    }, [currentQuestionIndex, currentQuestion]); // Fix the dependency

    const scrollToHighlightedLine = (index: number) => {
        if (viewportRef.current) {
            const lineHeight = 20;
            const position = lineHeight * (index - 2);
            viewportRef.current.scrollTo({ top: position, behavior: "smooth" });
        }
    };

    const handleQuestionChange = () => {
        if (!currentQuestion) return; // Ensure currentQuestion is loaded before running
        setHighlightedIndex(null);
        setHighlightedContext([]);

        if (currentQuestion.question_type === "general") {
            setHighlightedIndex(null);
            setHighlightedContext([]);
        }

        if (currentQuestion.question_type === "keyword") {
            const keyword = currentQuestion.keywords[0]?.keyword;
            const results = findLinesWithKeyword(fileString, keyword);
            const lineIndices = results.map((item) => item.index);

            if (lineIndices.length > 0) {
                const randomIndex = lineIndices[Math.floor(Math.random() * lineIndices.length)];
                setHighlightedIndex(randomIndex);
                scrollToHighlightedLine(randomIndex);
                console.log("Randomly highlighting keyword at line", randomIndex);
            }
        }

        // Find context lines dynamically
        if (currentQuestion.question_type === "context" && currentQuestion.context_keywords?.length > 0) {
            console.log("Finding context lines...", currentQuestion.context_keywords[0].keyword);
            const contextLines = findContext(fileString, currentQuestion.context_keywords[0].keyword);
            setHighlightedContext(contextLines);
        }
    };

    function findLinesWithKeyword(code: string, keyword?: string) {
        if (!keyword || !code) return [];
        return code
            .split("\n")
            .map((line, index) => ({ line, index }))
            .filter((item) => item.line.toLowerCase().includes(keyword.toLowerCase()));
    }

    function findContext(code: string, keyword?: string): number[] {
        if (!keyword || !code) return [];
        const lines = code.split("\n");
        let contextLines = new Set<number>();

        lines.forEach((line, index) => {
            if (line.includes(keyword)) {
                let bracketDepth = 0;
                let startLine = index;
                let endLine = index;

                // Move upwards to find the start of the context block
                for (let i = index; i >= 0; i--) {
                    const trimmed = lines[i].trim();
                    if (trimmed.endsWith("{")) {
                        bracketDepth--;
                        if (bracketDepth === 0) {
                            startLine = i;
                            break;
                        }
                    }
                    if (trimmed.match(/\b(if|for|while|function|class)\b/)) {
                        startLine = i;
                        break;
                    }
                    if (trimmed.includes("}")) {
                        bracketDepth++;
                    }
                }

                // Move downwards to find the end of the context block
                bracketDepth = 0;
                for (let i = index; i < lines.length; i++) {
                    const trimmed = lines[i].trim();
                    contextLines.add(i);
                    if (trimmed.includes("{")) {
                        bracketDepth++;
                    }
                    if (trimmed.includes("}")) {
                        bracketDepth--;
                        if (bracketDepth === 0) {
                            endLine = i;
                            break;
                        }
                    }
                }

                // Capture all lines in the found range
                for (let i = startLine; i <= endLine; i++) {
                    contextLines.add(i);
                }
            }
        });

        return Array.from(contextLines);
    }

    return (
        <ScrollArea
            ref={viewportRef} // Use ref instead of viewportRef
            style={{
                marginLeft: "2%",
                marginRight: "2%",
                marginTop: "1%",
                marginBottom: "1%",
                height: 700,
                width: "96%",
            }}
        >
            <SyntaxHighlighter
                language={language}
                style={atomDark}
                showLineNumbers
                wrapLines
                lineProps={(lineNumber) => {
                    const actualLine = lineNumber - 1; // Adjust for zero-based indexing
                    if (actualLine === highlightedIndex) {
                        return { style: { backgroundColor: "rgba(255, 0, 0, 0.5)", fontWeight: "bold" } };
                    }
                    if (highlightedContext.includes(actualLine)) {
                        return { style: { backgroundColor: "rgba(0, 0, 255, 0.5)", fontWeight: "bold" } };
                    }
                    return {};
                }}
                wrapLongLines
            >
                {fileString}
            </SyntaxHighlighter>
        </ScrollArea>
    );
}
