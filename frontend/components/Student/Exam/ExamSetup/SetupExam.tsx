import { Button, Text, Paper, Flex, Container, Title, Space, Select } from "@mantine/core";
import FileUploadButton from "./FileUploadButton";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useExam } from "../ExamDataProvider";
import LanguageSelector from "./LanguageSelector";

interface QuestionData {
  title: string;
  content: string;
}

interface ExamData {
  exam_id: number;
  exam_title: string;
  exam_instructions: string;
  available_from: string;
  available_to: string;
  access_code: string;
  questions: QuestionData[];
}

export default function SetupExam() {
  const { fileString, setFileString, setExamId, setExamDetails } = useExam();
  const [currentExams, setCurrentExams] = useState<ExamData[]>([]);
  const courseId = 2;
  const router = useRouter();
  
  useEffect(() => {
    const fetchCurrentExams = async () => {
      const response = await fetch(`http://localhost:3001/exams`);
      const exams = await response.json();
      setCurrentExams(exams);
      console.log(exams);
    };

    fetchCurrentExams();
  }, [courseId]);

  const handleStartExam = (e: React.FormEvent) => {
    e.preventDefault();
    if(fileString) {
      router.push('taking-exam');
    } else {
      alert('Please upload your exam file before starting.');
    }
  };
  
  const handleExamSelection = (value: string | null) => {
    console.log(value)
    if (value === null) {
      console.log("No exam selected");
      setExamId(0);  
    } else {
      const examId = parseInt(value);
      setExamId(examId);
    }
  };
  
  return (
    <Container size={1000} style={{ marginTop: '5%' }}>
      <Paper shadow="xl" radius="md">
        <Title order={2} style={{ paddingTop: "20px", marginLeft: "370px" }}>
          Exam Instructions
        </Title>
        <Text size="md" style={{ marginLeft: "200px", marginBottom: "20px" }}>
          Please select your exam and upload your exam file below to begin the examination.
        </Text>
        <Select
          size="md"
          style={{width: "61%", marginLeft: "200px", paddingTop: "20px", paddingBottom: "20px"}}
          label="Select Exam"
          placeholder="Choose an exam"
          data={currentExams.map(exam => ({ value: exam.exam_id.toString(), label: exam.exam_title }))}
          onChange={handleExamSelection}
          required
        />
        {/* <LanguageSelector/> */}
        <FileUploadButton setCodeFile={setFileString} />
        <Space h="md" />
        <Flex justify="center" style={{ marginTop: "20px", paddingBottom: "20px" }}>
          <Button size="md" onClick={handleStartExam} disabled={!fileString}>
            Start Exam
          </Button>
        </Flex>
      </Paper>
    </Container>
  );
}
