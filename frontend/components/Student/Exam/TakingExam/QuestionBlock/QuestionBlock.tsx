import { useEffect } from "react";
import { Paper, Text, ScrollArea, Flex, Button } from "@mantine/core";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { useExam } from "../../ExamDataProvider";
import VideoUploadButton from "./VideoSubmission/VideoUploadButton";

export default function QuestionBlock() {
    // Get exam and question details from exam context
    const { examDetails, setCurrentQuestion, currentQuestionIndex, setCurrentQuestionIndex } = useExam();

    // Update the current question on mount or when question index changes
    useEffect(() => {
        if (examDetails?.questions?.length && examDetails?.questions?.length > 0) {
            setCurrentQuestion(examDetails?.questions[currentQuestionIndex]);
        }
    }, [examDetails, currentQuestionIndex, setCurrentQuestion]);

    // Navigation handlers
    const handleNextQuestion = () => {
        if (examDetails?.questions?.length && currentQuestionIndex < examDetails?.questions?.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    // Time formatting function
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };
    let isLastQuestion = false;
    // Determine if it's the first or last question
    const isFirstQuestion = currentQuestionIndex === 0;
    if(examDetails?.questions?.length) {
        isLastQuestion = examDetails?.questions?.length > 0 && currentQuestionIndex === examDetails?.questions?.length - 1;
    }
    const timeRemaining = 300;

    return (
        <Paper 
            shadow="xs" 
            p="lg" 
            style={{ 
                backgroundColor: '#F0F0F0', 
                marginLeft: "2%", 
                marginRight: "2%", 
                marginTop: ".5%", 
                marginBottom: ".5%", 
                width: "96%", 
                overflow: "hidden"
            }}
        >
            <Flex justify="space-between" align="center">
                <Text size="xl" style={{ fontWeight: "500" }}>
                    {examDetails?.questions[currentQuestionIndex]?.question_title}
                </Text>
                <Text size="md" color="dimmed">
                    ({examDetails?.questions[currentQuestionIndex]?.question_type})
                </Text>
            </Flex>
            <ScrollArea style={{ height: "14%" }}>
                <Text size="xl">{examDetails?.questions[currentQuestionIndex]?.question_content}</Text>
            </ScrollArea>
            <Flex style={{ width: "100%", justifyContent: "center", alignItems: "center", marginBottom: "0px" }}>
                <Button leftSection={<IconArrowLeft />} disabled={isFirstQuestion} onClick={handlePreviousQuestion} style={{ marginRight: "20px" }}>
                    Previous Question
                </Button>
                <Text>Time remaining: {formatTime(timeRemaining)}</Text>
                {isLastQuestion ? (
                    <VideoUploadButton />
                ) : (
                    <Button rightSection={<IconArrowRight />} disabled={isLastQuestion} onClick={handleNextQuestion} style={{ marginLeft: "20px" }}>
                        Next Question
                    </Button>
                )}
            </Flex>
        </Paper>
    );
}
