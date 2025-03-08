import { Button, Container, Flex, Paper, Select, Space, Text, Title } from "@mantine/core";
import { useState } from "react";
import { useExam } from "../ExamDataProvider";
import { useRouter } from "next/navigation";
import LanguageSelector from "../ExamSetup/LanguageSelector";

type ExamOptions = {
  java: { value: string; label: string }[];
  "c++": { value: string; label: string }[];
  python: { value: string; label: string }[];
  typescript: { value: string; label: string }[];
};

export default function DemoExamSetup() {
  const router = useRouter();

  const examOptionsPerLanguage: ExamOptions = {
    java: [
      { value: "Longest Palindrome", label: "Longest Palindrome" },
      { value: "Container With Most Water", label: "Container With Most Water" },
      { value: "Binary Search Tree", label: "Binary Search Tree" },
    ],
    "c++": [
      { value: "Memory Management with Pointers", label: "Memory Management with Pointers" },
      { value: "Linked List with Pointers", label: "Linked List with Pointers" },
      { value: "File I/O with Raw Pointers", label: "File I/O with Raw Pointers" },
    ],
    python: [
      { value: "Web Scraper with BeautifulSoup", label: "Web Scraper with BeautifulSoup" },
      { value: "Data Analysis with Pandas", label: "Data Analysis with Pandas" },
      { value: "File Management Automation", label: "File Management Automation" },
    ],
    typescript: [
      { value: "To-Do List App with React", label: "To-Do List App with React" },
      { value: "API with TypeScript & Node", label: "API with TypeScript & Node" },
      { value: "Type-Safe Form Validation", label: "Type-Safe Form Validation" },
    ],
  };

  const { fileString, setFileString, setExamId, examLanguage, setExamLanguage, setExamDetails, setDemoExamDetails } = useExam();
  const [examOptions, setExamOptions] = useState<{ value: string; label: string }[]>([]);
  const [selectedExam, setSelectedExam] = useState<string | null>("");

  type ExamFiles = {
    java: Record<string, string>;
    "c++": Record<string, string>;
    python: Record<string, string>;
    typescript: Record<string, string>;
  };

  const examFiles: ExamFiles = {
    java: {
      "Longest Palindrome": "/DemoExams/Java/Longest_Palindrome/Longest_Palindrome.java",
      "Binary Search Tree": "/DemoExams/Java/Binary_Search_Tree/Binary_Search_Tree.java",
      "Employee Management with Inheritance": "/SampleCode/Employee_Management_with_Inheritance.java",
    },
    "c++": {
      "Memory Management with Pointers": "/SampleCode/C++/Memory_Management_with_Pointers.cpp",
      "Linked List with Pointers": "/SampleCode/C++/Linked_List_with_Pointers.cpp",
      "File I/O with Raw Pointers": "/SampleCode/C++/File_IO_with_Raw_Pointers.cpp",
    },
    python: {
      "Web Scraper with BeautifulSoup": "/SampleCode/Python/Web_Scraper_with_BeautifulSoup.py",
      "Data Analysis with Pandas": "/SampleCode/Python/Data_Analysis_with_Pandas.py",
      "File Management Automation": "/SampleCode/Python/File_Management_Automation.py",
    },
    typescript: {
      "To-Do List App with React": "/SampleCode/Typescript/To_Do_List_App_with_React.ts",
      "API with TypeScript & Node": "/SampleCode/Typescript/API_with_TypeScript_and_Node.ts",
      "Type-Safe Form Validation": "/SampleCode/Typescript/Type_Safe_Form_Validation.ts",
    },
  };

  const handleLanguageSelection = (value: string) => {
    setExamLanguage(value);
    const options = examOptionsPerLanguage[value as keyof ExamOptions] || [];
    setExamOptions(options);
    setSelectedExam(null);
  };

  const handleExamSelection = (value: string | null) => {
    if (value === null) {
      setExamId(0);
      setSelectedExam(null);
      return;
    }
    // Store the selected VALUE, not the label
    setSelectedExam(value);
    setExamId(parseInt(value));

    // Find the label for fetching the exam file
    const selectedExamLabel =
      examOptionsPerLanguage[examLanguage as keyof ExamOptions].find(
        (exam) => exam.value === value
      )?.label || null; // Ensure it's not undefined

    if (selectedExamLabel) {
      fetchExamFile(selectedExamLabel);
    }
  };

  const fetchExamFile = (examName: string) => {
    if (examLanguage) {
      const languageFiles = examFiles[examLanguage as keyof ExamFiles];
      const filePath = languageFiles[examName];
      if (filePath) {
        fetch(filePath)
          .then((response) => response.text())
          .then((code) => {
            setFileString(code);
          })
          .catch((error) => {
            console.error("Error fetching exam file:", error);
            setSelectedExam(null);
            alert("Error loading exam file.");
          });
      } else {
        alert("Exam file not found.");
      }
    }
  };

  const handleStartExam = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedExam) {
      setDemoExamDetails(examLanguage, selectedExam.replace(/ /g, '_'));
      if (fileString) {
        const examDetails = {
          exam_id: 1,
          exam_title: selectedExam,
          exam_instructions: "Please answer the following questions...",
          language: examLanguage,
          available_from: new Date().toISOString(),
          available_to: new Date(new Date().getTime() + 3600 * 1000).toISOString(),
          access_code: "12345",
          questions: [],
        };
        setExamDetails(examDetails);
        router.push("taking-exam");
      } else {
        alert("Please upload your exam file before starting.");
      }
    } else {
      alert("Please select an exam.");
    }
  };

  return (
    <Flex justify="center" align="center" style={{ height: "100vh" }}>
      <Container size={800}>
        <Paper shadow="xl" radius="md" p="lg">
          {/* Centered Title */}
          <Flex justify="center">
            <Title order={2}>Exam Instructions</Title>
          </Flex>

          <Space h="xl" />

          {/* Left-aligned text above Language Selector */}
          <Text size="md" style={{ textAlign: "left", fontSize: "17px", fontWeight: "600" }}>
            Select Preferred Language:
          </Text>
          <LanguageSelector onLanguageSelect={handleLanguageSelection} />
          <Select
            size="md"
            w="100%"
            mt="md"
            label="Select Exam:"
            placeholder="Choose an exam"
            data={examOptions}
            value={selectedExam} // Ensure `selectedExam` is the `value`
            onChange={(value: string | null) => {
              if (value) {
                handleExamSelection(value);
              }
            }}
            required
            disabled={!examLanguage}
          />

          <Space h="xl" />

          {/* Centered Start Exam Button */}
          <Flex justify="center" mt="lg">
            <Button size="md" onClick={handleStartExam} disabled={!examLanguage || !selectedExam}>
              Start Exam
            </Button>
          </Flex>
        </Paper>
      </Container>
    </Flex>
  );
}
