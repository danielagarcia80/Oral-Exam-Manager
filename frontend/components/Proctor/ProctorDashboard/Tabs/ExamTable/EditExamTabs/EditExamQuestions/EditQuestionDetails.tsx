// ____________________________________________________________________________________________________________

import { Button, Divider } from '@mantine/core';
import AddQuestionsModal from '../../CreateExamModal/CreateExamTabs/QuestionDetails/AddQuestionsModal/AddQuestionsModal';
import { QuestionsOrder } from '../../CreateExamModal/CreateExamTabs/QuestionDetails/QuestionsOrder/QuestionsOrder';

interface Props {
  questions: Questions[];
  examLinkedQuestions: Questions[];
  updateExamQuestions: (newQuestions: Questions[]) => void;
}

interface Questions {
  question_id: number; // Ensure there is a unique identifier
  question_title: string;
  question_content: string;
  question_type: string;
}

// ____________________________________________________________________________________________________________

export default function EditQuestionDetails({
  questions,
  examLinkedQuestions,
  updateExamQuestions,
}: Props) {
  // const [ExamQuestions, setExamQuestions] = useState<Questions[]>([]);

  return (
    <>
      <div style={{ marginTop: '2%' }}>
        <QuestionsOrder examQuestions={examLinkedQuestions} />
        <Divider style={{ margineTop: '2%', marginBottom: '2%' }} />
        <AddQuestionsModal
          questions={questions}
          examLinkedQuestions={examLinkedQuestions}
          setExamQuestions={updateExamQuestions}
          updateExamQuestions={updateExamQuestions}
        />
      </div>
    </>
  );
}
