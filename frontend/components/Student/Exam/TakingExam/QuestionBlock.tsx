import { Paper, Text, ScrollArea, Flex, Code } from "@mantine/core";
import { Question } from "@/static/utils/InstructorDataContext/InstructorDataContextTypes";

interface QuestionBlockProps {
    currentQuestion: Question;
}

export default function QuestionBlock({ currentQuestion }: QuestionBlockProps) {
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
                        {currentQuestion.question_title}
                    </Text>
                    <Text size="md" color="dimmed">
                        ({currentQuestion.question_type})
                    </Text>
            </Flex>
            <ScrollArea style={{ height: "120px" }}>
                <Text size="xl">{currentQuestion.question_content}</Text>
            </ScrollArea>
        </Paper>
    );
}
