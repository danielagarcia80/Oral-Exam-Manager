import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function hashPassword(password: string) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

async function main() {
  // Clear old data
  await prisma.examSubmission.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.teaches.deleteMany();
  await prisma.exam.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();


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

  // Create Student 0
  const student0 = await prisma.user.create({
    data: {
      email: 'student0@email.com',
      password: await hashPassword('student0_pass'),
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
      password: await hashPassword('student1_pass'),
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
        create: {
          instructor_id: instructor.user_id,
        },
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
