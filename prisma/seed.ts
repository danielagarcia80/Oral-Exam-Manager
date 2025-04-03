import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Hash passwords
  const hashPassword = async (plain: string) => await bcrypt.hash(plain, 10);

  // Create Instructor
  const instructor = await prisma.user.create({
    data: {
      email: 'instructor0@email.com',
      password: await hashPassword('instructor0_pass'),
      first_name: 'Instructor',
      last_name: 'Zero',
      role: 'INSTRUCTOR',
      account_creation_date: new Date(),
    },
  });

  // Create Course
  const course = await prisma.course.create({
    data: {
      title: 'Intro to CS',
      start_date: new Date('2025-04-03'),
      end_date: new Date('2025-07-02'),
      teaches: {
        create: {
          instructor_id: instructor.user_id,
        },
      },
    },
    include: {
      teaches: true,
    },
  });

  // Create Learning Outcome
  const learningOutcome = await prisma.learningOutcome.create({
    data: {
      description: 'Understand basic algorithms and data structures.',
    },
  });

  // Link Learning Outcome to Course
  await prisma.courseLearningOutcome.create({
    data: {
      course_id: course.course_id,
      learning_outcome_id: learningOutcome.learning_outcome_id,
    },
  });

  // Create Students
  const students = await Promise.all(
    [0, 1, 2].map(async (i) =>
      prisma.user.create({
        data: {
          email: `student${i}@email.com`,
          password: await hashPassword(`student${i}_pass`),
          first_name: `Student${i}`,
          last_name: 'User',
          role: 'STUDENT',
          account_creation_date: new Date(),
        },
      })
    )
  );

  // Enroll Students
  await Promise.all(
    students.map((student) =>
      prisma.enrollment.create({
        data: {
          student_id: student.user_id,
          course_id: course.course_id,
          status: 'ACTIVE',
        },
      })
    )
  );

  // Create Exam
  const exam = await prisma.exam.create({
    data: {
      title: 'Midterm 1',
      description: 'Basic CS midterm',
      course_id: course.course_id,
      type: 'ASYNCHRONOUS',
      start_date: new Date('2025-04-03'),
      end_date: new Date('2025-07-02'),
    },
  });

  // Create Question
  const question = await prisma.question.create({
    data: {
      text: 'What is a binary search?',
      difficulty: 2,
      type: 'EXPLAIN',
      source: 'Instructor Created',
      max_duration_minutes: 5,
    },
  });

  // Link Question to Exam
  await prisma.examIncludesQuestion.create({
    data: {
      exam_id: exam.exam_id,
      question_id: question.question_id,
      order_index: 1,
    },
  });

  // Link Question to Learning Outcome
  await prisma.questionAddressesOutcome.create({
    data: {
      question_id: question.question_id,
      learning_outcome_id: learningOutcome.learning_outcome_id,
    },
  });

  console.log('✅ Seed complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
