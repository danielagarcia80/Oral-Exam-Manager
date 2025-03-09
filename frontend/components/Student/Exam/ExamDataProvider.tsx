"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ExamContextType, ExamData, QuestionData } from './ExamDataTypes';
import language from 'react-syntax-highlighter/dist/esm/languages/hljs/1c';

const ExamContext = createContext<ExamContextType | undefined>(undefined);

export const ExamDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fileString, setFileString] = useState<string>("");
  const [examLanguage, setExamLanguage] = useState<string>("");
  const [courseId, setCourseId] = useState<number>(1);
  const [examId, setExamId] = useState<number>(0);
  const [examDetails, setExamDetails] = useState<ExamData | null>(null);
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionData>();

  const fetchExamDetails = async () => {
    try {
      const response = await fetch(`http://localhost:3001/exams/${examId}/details`);
      if (!response.ok) {
        throw new Error('Failed to fetch exam details');
      }
      const data: { data: ExamData } = await response.json();
      console.log(data);

      const processedQuestions = data.data.questions.map(question => ({
        ...question,
        general_keywords: question.keywords.filter(k => k.type === 'general'),
        context_keywords: question.keywords.filter(k => k.type === 'context')
      }));

      const sortedQuestions = processedQuestions.sort((a, b) => {
        const order: Record<string, number> = { Generalized: 1, Keyword: 2, Context: 3 };
        return (order[a.question_type] || 4) - (order[b.question_type] || 4);
      });

      setExamDetails({ ...data.data, questions: sortedQuestions });
    } catch (error) {
      console.error('Error fetching exam details:', error);
    }
  };

    // Function to set demo exam details from a local JSON file
    const setDemoExamDetails = async (selectedLanguage: String, selectedDemoExam: String) => {
      try {
        const directory = '/DemoExams/' + selectedLanguage + "/" + selectedDemoExam + "/" + selectedDemoExam + ".json"
        const response = await fetch(directory);

        if (!response.ok) {
          throw new Error('Failed to fetch demo exam details');
        }
        const data: ExamData = await response.json();

        const processedQuestions = data.questions.map((question) => ({
          ...question,
          general_keywords: question.keywords.filter((k) => k.type === 'general'),
          context_keywords: question.keywords.filter((k) => k.type === 'context'),
        }));
  
        // Sorting questions by type
        const sortedQuestions = processedQuestions.sort((a, b) => {
          const order: Record<string, number> = { Generalized: 1, Keyword: 2, Context: 3 };
          return (order[a.question_type] || 4) - (order[b.question_type] || 4);
        });
  
        // Setting the exam details and questions
        setExamDetails({ ...data, questions: sortedQuestions });
      } catch (error) {
        console.error('Error setting demo exam details:', error);
      }
    };

  return (
    <ExamContext.Provider value={{
      fileString,
      setFileString,
      examLanguage,
      setExamLanguage,
      courseId,
      examId,
      setExamId,
      examDetails,
      setExamDetails,
      questions,
      setQuestions,
      currentQuestion,
      setCurrentQuestion,
      setDemoExamDetails
    }}>
      {children}
    </ExamContext.Provider>
  );
};

export const useExam = () => {
  const context = useContext(ExamContext);
  if (!context) {
    throw new Error('useExam must be used within an ExamProvider');
  }
  return context;
};
