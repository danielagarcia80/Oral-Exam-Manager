import cx from 'clsx';
import { Button, Flex, rem, Text } from '@mantine/core';
import { useListState } from '@mantine/hooks';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { IconGripVertical } from '@tabler/icons-react';
import classes from './QuestionsOrder.module.css';
import { useEffect } from 'react';

interface Props {
  examQuestions: Question[]; 
}
interface Question { 
  question_id: number;  // Ensure each question has a unique id
  question_title: string;
  question_content: string;
  question_type: string;
}

export function QuestionsOrder({ examQuestions }: Props) {
  const [questions, setQuestions] = useListState<Question>(examQuestions);

  useEffect(() => {
    setQuestions.setState(examQuestions);
  }, [examQuestions]);

  const items = questions.map((item, index) => (
  <Draggable key={item.question_id.toString()} index={index} draggableId={item.question_id.toString()}>
    {(provided, snapshot) => (
      <div
        className={cx(classes.item, { [classes.itemDragging]: snapshot.isDragging })}
        ref={provided.innerRef}
        {...provided.draggableProps}
      >
        <div {...provided.dragHandleProps} className={classes.dragHandle}>
          <IconGripVertical style={{ width: rem(25), height: rem(25) }} stroke={1.5} />
        </div>
        <Text size="xl" style={{fontWeight: "500"}}>Q{index + 1}</Text>
        <Flex style={{ marginLeft: "2%" }}>
          <div>
            <Text size="xl" style={{fontWeight: "500"}}>
              {item.question_title} ({item.question_type})
            </Text>
            <Text color="dimmed" size="sm">
              
            </Text>
            <Text size="lg">
              {item.question_content}
            </Text>
          </div>
        </Flex>
      </div>
    )}
  </Draggable>
));

  return (
  <>
    <Text style={{fontSize: "40px", marginLeft: "40%", marginBottom: "30px"}}>Exam Questions</Text>
    <DragDropContext
      onDragEnd={({ destination, source }) => {
        if (!destination) {
          return;
        }
        setQuestions.reorder({ from: source.index, to: destination.index });
      }}
    >
      <Droppable droppableId="dnd-list" direction="vertical">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {items}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
    </>
  );
}