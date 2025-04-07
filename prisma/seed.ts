import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function hashPassword(password: string) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

async function main() {
  // Clear old data in proper order to avoid constraint errors
  await prisma.examSubmission.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.teaches.deleteMany();

  await prisma.examIncludesQuestion.deleteMany();
  await prisma.questionHasKeyword.deleteMany();
  await prisma.questionHasImage.deleteMany();
  await prisma.questionAddressesOutcome.deleteMany();
  await prisma.courseLearningOutcome.deleteMany();

  await prisma.exam.deleteMany();
  await prisma.question.deleteMany();
  await prisma.learningOutcome.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  // Create Instructor 0
  const instructor0 = await prisma.user.create({
    data: {
      email: 'instructor0@email.com',
      password: await hashPassword('password'),
      first_name: 'Instructor',
      last_name: 'Zero',
      role: 'INSTRUCTOR',
      account_creation_date: new Date(),
    },
  });

  // Create Instructor 1
  const instructor1 = await prisma.user.create({
    data: {
      email: 'instructor1@email.com',
      password: await hashPassword('password'),
      first_name: 'Instructor',
      last_name: 'One',
      role: 'INSTRUCTOR',
      account_creation_date: new Date(),
    },
  });

  // Create Student 0
  const student0 = await prisma.user.create({
    data: {
      email: 'student0@email.com',
      password: await hashPassword('password'),
      first_name: 'Student',
      last_name: 'Zero',
      role: 'STUDENT',
      account_creation_date: new Date(),
    },
  });

  // Create Student 1
  const student1 = await prisma.user.create({
    data: {
      email: 'student1@email.com',
      password: await hashPassword('password'),
      first_name: 'Student',
      last_name: 'One',
      role: 'STUDENT',
      account_creation_date: new Date(),
    },
  });

  // Create a course
  const course = await prisma.course.create({
    data: {
      title: 'Intro to Computer Science',
      description: 'An introduction to foundational computer science concepts.',
      start_date: new Date('2025-04-01'),
      end_date: new Date('2025-07-01'),
      banner_url: 'uploads/sample-banner.png',
      teaches: {
        create: [
          { instructor_id: instructor0.user_id },
          { instructor_id: instructor1.user_id }
        ],
      },
      enrollments: {
        create: [
          {
            student_id: student0.user_id,
            status: 'ENROLLED',
          },
          {
            student_id: student1.user_id,
            status: 'ENROLLED',
          },
        ],
      },
    },
  });

  // Creating learning outcomes
  const learningOutcome0 = await prisma.learningOutcome.create({
    data: {
      description: 'Understand basic algorithm design and complexity analysis.',
    },
  });

  await prisma.courseLearningOutcome.create({
    data: {
      course_id: course.course_id,
      learning_outcome_id: learningOutcome0.learning_outcome_id,
    },
  });


  const learningOutcome1 = await prisma.learningOutcome.create({
    data: {
      description: 'Understand basic process scheduling techniques.',
    },
  });


  await prisma.courseLearningOutcome.create({
    data: {
      course_id: course.course_id,
      learning_outcome_id: learningOutcome1.learning_outcome_id,
    },
  });

  // Creating Questions
  const question0 = await prisma.question.create({
    data: {
      text: 'What is the time complexity of binary search?',
      difficulty: 1,
      type: 'FREE_RESPONSE',
      source: 'seeded',
      max_duration_minutes: 5,
    },
  });

  await prisma.questionAddressesOutcome.create({
    data: {
      question_id: question0.question_id,
      learning_outcome_id: learningOutcome0.learning_outcome_id,
    },
  });


  const question1 = await prisma.question.create({
    data: {
      text: 'What is the difference between a preemptive and a non-preemptive process scheduling policy?',
      difficulty: 1,
      type: 'FREE_RESPONSE',
      source: 'seeded',
      max_duration_minutes: 5,
    },
  });

  await prisma.questionAddressesOutcome.create({
    data: {
      question_id: question1.question_id,
      learning_outcome_id: learningOutcome1.learning_outcome_id,
    },
  });


  // Add exams to the course
  await prisma.exam.createMany({
    data: [
      {
        title: 'Midterm Exam',
        description: 'Covers weeks 1–6 material.',
        type: 'ASYNCHRONOUS',
        course_id: course.course_id,
        start_date: new Date('2025-05-01T09:00:00Z'),
        end_date: new Date('2025-05-07T23:59:59Z'),
      },
      {
        title: 'Final Exam',
        description: 'Comprehensive final exam.',
        type: 'ASYNCHRONOUS',
        course_id: course.course_id,
        start_date: new Date('2025-06-15T09:00:00Z'),
        end_date: new Date('2025-06-21T23:59:59Z'),
      },
      {
        title: 'Exam 1',
        description: 'First exam of the course.',
        type: 'ASYNCHRONOUS',
        course_id: course.course_id,
        start_date: new Date('2025-01-15T09:00:00Z'),
        end_date: new Date('2025-01-21T23:59:59Z'),
      },
    ],
  });

  console.log('Database has been seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
