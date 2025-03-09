import { Paper, Text, ScrollArea, Flex, Code, Button } from "@mantine/core";
import { QuestionData } from "../ExamDataTypes";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import VideoUploadButton from "./VideoSubmission/VideoUploadButton";
import { useExam } from "../ExamDataProvider";

const timeRemaining = 300;
const isFirstQuestion = false;
const isLastQuestion = false;

const currentQuestionIndex = 0;
const setCurrentQuestionIndex = (index: number) => {};
const examDetails = {
    questions: [ "" ]
};

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

function formatTime(seconds: number) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export default function QuestionBlock() {
    // Get exam and question details from exam context
    const examDetails = useExam().examDetails;
    console.log(examDetails);
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
                height: "150px",
                width: "96%", 
                overflow: "hidden"
            }}
        >
            <Flex justify="space-between" align="center">
                    <Text size="xl" style={{ fontWeight: "500" }}>
                        {examDetails?.questions[0].question_title}
                    </Text>
                    <Text size="md" color="dimmed">
                        ({examDetails?.questions[0].question_type})
                    </Text>
            </Flex>
            <ScrollArea style={{ height: "120px" }}>
                <Text size="xl">{examDetails?.questions[0].question_content}</Text>
            </ScrollArea>
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
        </Paper>
    );
}
