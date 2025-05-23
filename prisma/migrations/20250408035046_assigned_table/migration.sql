/*
  Warnings:

  - Added the required column `duration_minutes` to the `Exam` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Exam` ADD COLUMN `duration_minutes` INTEGER NOT NULL,
    ADD COLUMN `requires_audio` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `requires_screen_share` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `requires_video` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `timing_mode` ENUM('OVERALL', 'PER_QUESTION') NOT NULL DEFAULT 'OVERALL';

-- AlterTable
ALTER TABLE `ExamIncludesQuestion` ADD COLUMN `time_allocation` INTEGER NULL;

-- CreateTable
CREATE TABLE `AssignedExam` (
    `id` VARCHAR(191) NOT NULL,
    `exam_id` VARCHAR(191) NOT NULL,
    `student_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `AssignedExam_exam_id_student_id_key`(`exam_id`, `student_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AssignedExam` ADD CONSTRAINT `AssignedExam_exam_id_fkey` FOREIGN KEY (`exam_id`) REFERENCES `Exam`(`exam_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AssignedExam` ADD CONSTRAINT `AssignedExam_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
