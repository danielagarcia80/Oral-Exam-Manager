import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const prisma = new PrismaClient();

async function hashPassword(password: string) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

async function main() {
  console.log('🌱 Clearing old data...');
  await prisma.examSubmission.deleteMany();
  await prisma.assignedExam.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.teaches.deleteMany();
  await prisma.courseMembership.deleteMany();
  await prisma.examIncludesQuestion.deleteMany();
  await prisma.questionHasKeyword.deleteMany();
  await prisma.questionHasImage.deleteMany();
  await prisma.questionAddressesOutcome.deleteMany();
  await prisma.courseLearningOutcome.deleteMany();
  await prisma.exam.deleteMany();
  await prisma.question.deleteMany();
  await prisma.learningOutcome.deleteMany();
  await prisma.questionImages.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  console.log('🌱 Creating users...');
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

  const ta = await prisma.user.create({
    data: {
      email: 'ta@email.com',
      password: await hashPassword('password'),
      first_name: 'TA',
      last_name: 'Jones',
      role: 'STUDENT',
      account_creation_date: new Date(),
    },
  });

  console.log('🌱 Creating course...');
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
          { instructor_id: instructor1.user_id },
        ],
      },
      enrollments: {
        create: [
          { student_id: student0.user_id, status: 'ENROLLED' },
          { student_id: student1.user_id, status: 'ENROLLED' },
        ],
      },
    },
  });

  await prisma.courseMembership.createMany({
    data: [
      {
        userId: instructor0.user_id,
        courseId: course.course_id,
        role: 'INSTRUCTOR',
      },
      {
        userId: instructor1.user_id,
        courseId: course.course_id,
        role: 'INSTRUCTOR',
      },
      {
        userId: student0.user_id,
        courseId: course.course_id,
        role: 'STUDENT',
      },
      {
        userId: student1.user_id,
        courseId: course.course_id,
        role: 'STUDENT',
      },
      {
        userId: ta.user_id,
        courseId: course.course_id,
        role: 'TA',
      },
    ],
  });
  

  console.log('🌱 Creating learning outcomes...');
  const outcome0 = await prisma.learningOutcome.create({
    data: {
      description: 'Understand basic algorithm design and complexity analysis.',
    },
  });

  const outcome1 = await prisma.learningOutcome.create({
    data: {
      description: 'Understand basic process scheduling techniques.',
    },
  });

  await prisma.courseLearningOutcome.createMany({
    data: [
      { course_id: course.course_id, learning_outcome_id: outcome0.learning_outcome_id },
      { course_id: course.course_id, learning_outcome_id: outcome1.learning_outcome_id },
    ],
  });

  console.log('🌱 Creating questions...');
  const question0 = await prisma.question.create({
    data: {
      text: 'What is the time complexity of binary search?',
      difficulty: 1,
      type: 'FREE_RESPONSE',
      source: 'seeded',
      max_duration_minutes: 5,
      outcomes: {
        create: {
          learning_outcome_id: outcome0.learning_outcome_id,
        },
      },
    },
  });

  const question1 = await prisma.question.create({
    data: {
      text: 'What is the difference between a preemptive and a non-preemptive process scheduling policy?',
      difficulty: 1,
      type: 'FREE_RESPONSE',
      source: 'seeded',
      max_duration_minutes: 5,
      outcomes: {
        create: {
          learning_outcome_id: outcome1.learning_outcome_id,
        },
      },
    },
  });

  console.log('🌱 Creating exams...');
  const exam = await prisma.exam.create({
    data: {
      title: 'Midterm Exam',
      description: 'Covers weeks 1–6 material.',
      type: 'ASYNCHRONOUS',
      course_id: course.course_id,
      start_date: new Date('2025-05-01T09:00:00Z'),
      end_date: new Date('2025-05-07T23:59:59Z'),
      duration_minutes: 30,
      timing_mode: 'OVERALL',
      requires_audio: true,
      requires_video: true,
      requires_screen_share: true,
    },
  });

  const pastExam = await prisma.exam.create({
    data: {
      title: 'Syllabus Quiz',
      description: 'Covers weeks 1–6 material.',
      type: 'ASYNCHRONOUS',
      course_id: course.course_id,
      start_date: new Date('2025-01-01T09:00:00Z'),
      end_date: new Date('2025-01-02T23:59:59Z'),
      duration_minutes: 30,
      timing_mode: 'OVERALL',
      requires_audio: true,
      requires_video: true,
      requires_screen_share: true,
    },
  });

  await prisma.assignedExam.createMany({
    data: [
      {
        exam_id: pastExam.exam_id,
        student_id: student0.user_id,
      },
      {
        exam_id: pastExam.exam_id,
        student_id: student1.user_id,
      },
    ],
  });

  await prisma.assignedExam.createMany({
    data: [
      {
        exam_id: exam.exam_id,
        student_id: student0.user_id,
      },
      {
        exam_id: exam.exam_id,
        student_id: student1.user_id,
      },
    ],
  });
  
  

  await prisma.examIncludesQuestion.createMany({
    data: [
      {
        exam_id: exam.exam_id,
        question_id: question0.question_id,
        order_index: 0,
      },
      {
        exam_id: exam.exam_id,
        question_id: question1.question_id,
        order_index: 1,
      },
    ],
  });

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
