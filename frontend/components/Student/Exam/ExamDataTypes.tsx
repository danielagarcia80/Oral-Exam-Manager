export interface ExamContextType {
  fileString: string;
  setFileString: (file: string) => void;
  examLanguage: string;
  setExamLanguage: (file: string) => void;
  courseId: number;
  examId: number;
  setExamId: (id: number) => void;
  examDetails: ExamData | null;
  setExamDetails: (exam: ExamData) => void;
  questions: QuestionData[];
  setQuestions: (questions: QuestionData[]) => void;
  currentQuestion: QuestionData | undefined;
  setCurrentQuestion: (question: QuestionData) => void;
  setDemoExamDetails: (language: String, selectedDemoExam: String) => void; 
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (id: number) => void;

}

export interface ExamData {
    exam_id: number;
    exam_title: string;
    exam_instructions: string;
    language?: string;
    available_from: string;
    available_to: string;
    access_code: string;
    questions: QuestionData[];
  }

export interface QuestionData {
    question_id: number;
    question_title: string;
    question_type: string;
    question_content: string;
    keywords: { keyword: string, type: string }[];
    context_keywords: { keyword: string, type: string }[];
    general_keywords: { keyword: string, type: string }[];
  }