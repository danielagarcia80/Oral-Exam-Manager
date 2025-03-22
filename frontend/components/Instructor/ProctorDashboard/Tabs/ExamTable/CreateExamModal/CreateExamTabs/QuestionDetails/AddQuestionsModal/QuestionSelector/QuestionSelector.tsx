
// ____________________________________________________________________________________________________________

import { Flex, ScrollArea, Text, Divider, Box, Button, Paper, Center } from "@mantine/core";
import { QuestionTopics } from "./Topics/QuestionTopics";
import QuestionsByTopic from "./Questions/QuestionsByTopic";
import classes from "./QuestionSelector.module.css";
import { IconEdit } from "@tabler/icons-react";
import { useState } from "react";

// ____________________________________________________________________________________________________________

interface Questions {
  question_id: number; // Ensure there is a unique identifier
  question_title: string;
  question_content: string;
  question_type: string;
}

interface Props {
  onClose: () => void;
  questions: Questions[];
  examQuestions: Questions[];
  setExamQuestions: (newQuestions: Questions[]) => void;
  updateExamQuestions: (newQuestions: Questions[]) => void;
  closeModal?: () => void
}

// ____________________________________________________________________________________________________________

const QuestionSelector: React.FC<Props> = ({ onClose, questions, examQuestions, setExamQuestions, updateExamQuestions, closeModal }) => {
  
  return (
    <>
      {/* <Text>Question Selection</Text> */}
      
      <Text style={{marginLeft: "30%", fontSize: "30px", marginBottom: "20px"}}>Select Questions for the exam</Text>
      <Paper>
        <Divider/>
        <Flex>
          {/* <Divider/>
          <Box style={{ flex: '1 1 33.33%' }}>
            <Center className={classes.title}>
              Topics
            </Center>
            <Divider/>
            <ScrollArea h={400}>
              <QuestionTopics />
            </ScrollArea>
          </Box>
          <Divider size="md" orientation="vertical" /> */}
          
          <Box style={{ flex: '1 1 66.66%' }}>
            {/* <Center className={classes.title}>Questions</Center> */}
            <ScrollArea>
              <QuestionsByTopic closeModal={closeModal} questionProp={questions} examQuestions={examQuestions} setExamQuestions={setExamQuestions} updateExamQuestions={updateExamQuestions}/>
            </ScrollArea>
          </Box>
        </Flex>

      </Paper>
    </>
  );
}

export default QuestionSelector;