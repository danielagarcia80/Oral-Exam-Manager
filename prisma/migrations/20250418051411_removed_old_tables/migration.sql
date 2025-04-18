/*
  Warnings:

  - You are about to drop the `Enrollment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Teaches` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Enrollment` DROP FOREIGN KEY `Enrollment_course_id_fkey`;

-- DropForeignKey
ALTER TABLE `Enrollment` DROP FOREIGN KEY `Enrollment_student_id_fkey`;

-- DropForeignKey
ALTER TABLE `Teaches` DROP FOREIGN KEY `Teaches_course_id_fkey`;

-- DropForeignKey
ALTER TABLE `Teaches` DROP FOREIGN KEY `Teaches_instructor_id_fkey`;

-- DropTable
DROP TABLE `Enrollment`;

-- DropTable
DROP TABLE `Teaches`;
