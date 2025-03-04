import { Button, Text, Paper, Flex, ScrollArea, Code } from "@mantine/core";
import { useEffect, useRef, useState } from 'react';
import { useExam } from "../ExamDataProvider";
import { useMemo } from "react";
import VideoUploadButton from "./VideoSubmission/VideoUploadButton";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import CodeBlock from "./CodeBlock";
import QuestionBlock from "./QuestionBlock";

function formatTime(seconds: number) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export default function TakingExam() {
        const viewportRef = useRef<HTMLDivElement>(null);
        const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
        const { fileString, examDetails, examLanguage } = useExam();
        const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
        const [highlightedContextIndices, setHighlightedContextIndices] = useState<number[] | null>(null);
        const [timeRemaining, setTimeRemaining] = useState(600);
        const defaultQuestion = {
                question_id: -1,
                question_title: "No question available",
                question_type: "None",
                question_content: "There are currently no questions to display.",
                keywords: [],
                context_keywords: [],
                general_keywords: []
        };

        // Accessing currentQuestion from examDetails.questions
        const currentQuestion = useMemo(() => {
                return examDetails?.questions[currentQuestionIndex] || defaultQuestion;
        }, [examDetails, currentQuestionIndex]);

        const memoizedCode = useMemo(() => {
                return <CodeBlock 
                            code={fileString} 
                            highlightLines={[3]} 
                            highlightContext={[1, 2, 3, 4, 5]} 
                            language={examLanguage.toLowerCase()}
                        />;
            }, [fileString, currentQuestionIndex]);
            

        useEffect(() => {
                const interval = setInterval(() => {
                        setTimeRemaining(time => {
                                if (time <= 1) clearInterval(interval);
                                return time - 1;
                        });
                }, 1000);
                return () => clearInterval(interval);
        }, []);

        useEffect(() => {
                if (currentQuestion && currentQuestion.question_type === "Generalized" && currentQuestion.keywords.length > 0) {
                        console.log("Generalized");
                } else if (currentQuestion && currentQuestion.question_type === "Keyword" && currentQuestion.keywords.length > 0) {
                        setHighlightedContextIndices([]);
                        const lines = fileString.split('\n');
                        const indices = lines.reduce((acc, line, index) => {
                                if (line.includes(currentQuestion.keywords[0].keyword)) {
                                        acc.push(index);
                                }
                                return acc;
                        }, [] as number[]);
                        if (indices.length > 0) {
                                const randomIndex = indices[Math.floor(Math.random() * indices.length)];
                                setHighlightedIndex(randomIndex);
                                scrollToLine(randomIndex);
                        } else {
                                setHighlightedIndex(null);
                        }
                } else if (currentQuestion && currentQuestion.question_type === "Context" && currentQuestion.keywords.length > 0) {
                        console.log("Current Context Questions", currentQuestion)
                        setHighlightedIndex(null);
                        const lines = fileString.split('\n');
                        let allContexts: number[][] = [];
                        let contextIndices: number[] = [];
                        let isInContext = false;
                        let bracketCount = 0;
                        let hasGeneralKeyword: boolean = false;
                        let generalKeywordIndices: number[] = []
                        lines.forEach((line, index) => {
                                if (currentQuestion.context_keywords && line.includes(currentQuestion.context_keywords[0].keyword) && line.includes('{')) {
                                        isInContext = true;
                                        // bracketCount++;
                                }
                                if (isInContext) {
                                        contextIndices.push(index);
                                }
                                if (isInContext && line.includes('{')) {
                                        bracketCount++;
                                }
                                if(currentQuestion.general_keywords && isInContext && line.includes(currentQuestion.general_keywords[0].keyword)){
                                        generalKeywordIndices.push(index)
                                        hasGeneralKeyword = true;
                                        
                                }
                                if (isInContext && line.includes('}')) {
                                        bracketCount--;

                                        if (bracketCount === 0) {
                                                isInContext = false;
                                                if (hasGeneralKeyword) {
                                                        allContexts.push([...contextIndices]);
                                                }
                                                hasGeneralKeyword = false;
                                                console.log(contextIndices)
                                                contextIndices = [];
                                        }
                                }
                        });
                        if (allContexts.length > 0) {
                                const randomContextIndex = Math.floor(Math.random() * allContexts.length);
                                setHighlightedContextIndices(allContexts[randomContextIndex]);
                                scrollToLine(allContexts[randomContextIndex][0]);
                                const validIndices = generalKeywordIndices.filter(index => allContexts[randomContextIndex].includes(index));
                                if (validIndices.length > 0) {
                                        const randomGeneralIndex = validIndices[Math.floor(Math.random() * validIndices.length)];
                                        setHighlightedIndex(randomGeneralIndex);
                                        scrollToLine(randomGeneralIndex);
                                    } else {
                                        setHighlightedIndex(null);
                                    }
                        } else {
                                setHighlightedContextIndices([]);
                        }
                } else {
                        setHighlightedIndex(null);
                }
        }, [currentQuestionIndex, examDetails, fileString]);

        const isLastQuestion = currentQuestionIndex === (examDetails?.questions.length ?? 1) - 1;
        const isFirstQuestion = currentQuestionIndex === 0;

        function handleNextQuestion() {
                if (currentQuestionIndex < (examDetails?.questions.length ?? 0) - 1) {
                        setCurrentQuestionIndex(currentQuestionIndex + 1);
                }
        }

        function handlePreviousQuestion() {
                if (currentQuestionIndex > 0) {
                        setCurrentQuestionIndex(currentQuestionIndex - 1);
                }
        }

        const scrollToLine = (lineIndex: number) => {
                if (viewportRef.current) {
                        const lineHeight = 20;
                        const position = lineHeight * lineIndex;
                        viewportRef.current.scrollTop = position - (viewportRef.current.offsetHeight / 2);
                }
        };

        return (
                <>
                <CodeBlock
                        code={fileString} 
                        highlightLines={[]} 
                        highlightContext={[]} 
                />
                <QuestionBlock currentQuestion={currentQuestion}/>
                <Flex style={{ width: "100%", justifyContent: "center", alignItems: "center", marginBottom: "0px" }}>
                <Button leftSection={<IconArrowLeft/>} disabled={isFirstQuestion} onClick={handlePreviousQuestion} style={{ marginRight: "20px" }}>
                        Previous Question
                </Button>
                <Text>Time remaining: {formatTime(timeRemaining)}</Text>
                {isLastQuestion ? (
                        <VideoUploadButton />
                ) : (
                        <Button rightSection={<IconArrowRight/>}disabled={isLastQuestion} onClick={handleNextQuestion} style={{ marginLeft: "20px" }}>
                                Next Question
                        </Button>
                )}
                </Flex>

                </>
        );
}
