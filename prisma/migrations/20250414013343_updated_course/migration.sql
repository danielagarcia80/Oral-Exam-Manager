/*
  Warnings:

  - Added the required column `course_id` to the `QuestionImages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `QuestionImages` ADD COLUMN `course_id` VARCHAR(191) NOT NULL,
    MODIFY `image_data` VARCHAR(191) NOT NULL,
    ALTER COLUMN `original_filename` DROP DEFAULT;

-- AddForeignKey
ALTER TABLE `QuestionImages` ADD CONSTRAINT `QuestionImages_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `Course`(`course_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
