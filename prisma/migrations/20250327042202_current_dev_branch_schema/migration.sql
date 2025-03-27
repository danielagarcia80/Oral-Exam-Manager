/*
  Warnings:

  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Course` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CourseLearningOutcome` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Enrollment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Exam` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ExamIncludesQuestion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ExamSubmission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FileUpload` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Keyword` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LearningOutcome` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Question` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QuestionAddressesOutcome` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QuestionHasImage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QuestionHasKeyword` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QuestionImages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Teaches` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Account` DROP FOREIGN KEY `Account_userId_fkey`;

-- DropForeignKey
ALTER TABLE `CourseLearningOutcome` DROP FOREIGN KEY `CourseLearningOutcome_course_id_fkey`;

-- DropForeignKey
ALTER TABLE `CourseLearningOutcome` DROP FOREIGN KEY `CourseLearningOutcome_learning_outcome_id_fkey`;

-- DropForeignKey
ALTER TABLE `Enrollment` DROP FOREIGN KEY `Enrollment_course_id_fkey`;

-- DropForeignKey
ALTER TABLE `Enrollment` DROP FOREIGN KEY `Enrollment_student_id_fkey`;

-- DropForeignKey
ALTER TABLE `Exam` DROP FOREIGN KEY `Exam_course_id_fkey`;

-- DropForeignKey
ALTER TABLE `ExamIncludesQuestion` DROP FOREIGN KEY `ExamIncludesQuestion_exam_id_fkey`;

-- DropForeignKey
ALTER TABLE `ExamIncludesQuestion` DROP FOREIGN KEY `ExamIncludesQuestion_question_id_fkey`;

-- DropForeignKey
ALTER TABLE `ExamSubmission` DROP FOREIGN KEY `ExamSubmission_exam_id_fkey`;

-- DropForeignKey
ALTER TABLE `ExamSubmission` DROP FOREIGN KEY `ExamSubmission_student_id_fkey`;

-- DropForeignKey
ALTER TABLE `FileUpload` DROP FOREIGN KEY `FileUpload_question_id_fkey`;

-- DropForeignKey
ALTER TABLE `QuestionAddressesOutcome` DROP FOREIGN KEY `QuestionAddressesOutcome_learning_outcome_id_fkey`;

-- DropForeignKey
ALTER TABLE `QuestionAddressesOutcome` DROP FOREIGN KEY `QuestionAddressesOutcome_question_id_fkey`;

-- DropForeignKey
ALTER TABLE `QuestionHasImage` DROP FOREIGN KEY `QuestionHasImage_image_id_fkey`;

-- DropForeignKey
ALTER TABLE `QuestionHasImage` DROP FOREIGN KEY `QuestionHasImage_question_id_fkey`;

-- DropForeignKey
ALTER TABLE `QuestionHasKeyword` DROP FOREIGN KEY `QuestionHasKeyword_keyword_id_fkey`;

-- DropForeignKey
ALTER TABLE `QuestionHasKeyword` DROP FOREIGN KEY `QuestionHasKeyword_question_id_fkey`;

-- DropForeignKey
ALTER TABLE `Session` DROP FOREIGN KEY `Session_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Teaches` DROP FOREIGN KEY `Teaches_course_id_fkey`;

-- DropForeignKey
ALTER TABLE `Teaches` DROP FOREIGN KEY `Teaches_instructor_id_fkey`;

-- DropTable
DROP TABLE `Account`;

-- DropTable
DROP TABLE `Course`;

-- DropTable
DROP TABLE `CourseLearningOutcome`;

-- DropTable
DROP TABLE `Enrollment`;

-- DropTable
DROP TABLE `Exam`;

-- DropTable
DROP TABLE `ExamIncludesQuestion`;

-- DropTable
DROP TABLE `ExamSubmission`;

-- DropTable
DROP TABLE `FileUpload`;

-- DropTable
DROP TABLE `Keyword`;

-- DropTable
DROP TABLE `LearningOutcome`;

-- DropTable
DROP TABLE `Question`;

-- DropTable
DROP TABLE `QuestionAddressesOutcome`;

-- DropTable
DROP TABLE `QuestionHasImage`;

-- DropTable
DROP TABLE `QuestionHasKeyword`;

-- DropTable
DROP TABLE `QuestionImages`;

-- DropTable
DROP TABLE `Session`;

-- DropTable
DROP TABLE `Teaches`;

-- DropTable
DROP TABLE `User`;

-- DropTable
DROP TABLE `VerificationToken`;

-- CreateTable
CREATE TABLE `Test` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `password` VARCHAR(191) NULL,

    UNIQUE INDEX `Test_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `accounts` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `provider_account_id` VARCHAR(191) NOT NULL,
    `refresh_token` TEXT NULL,
    `access_token` TEXT NULL,
    `expires_at` INTEGER NULL,
    `token_type` VARCHAR(191) NULL,
    `scope` VARCHAR(191) NULL,
    `id_token` TEXT NULL,
    `session_state` VARCHAR(191) NULL,

    INDEX `Account_userId_fkey`(`user_id`),
    UNIQUE INDEX `accounts_provider_provider_account_id_key`(`provider`, `provider_account_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sessions` (
    `id` VARCHAR(191) NOT NULL,
    `session_token` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `sessions_session_token_key`(`session_token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `email_verified` DATETIME(3) NULL,
    `password` VARCHAR(191) NULL,
    `image` VARCHAR(191) NULL,
    `isDeleted` BOOLEAN NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `role_id` VARCHAR(191) NOT NULL,
    `role_type` VARCHAR(191) NULL DEFAULT 'DEFAULT',

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `verification_tokens` (
    `identifier` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `verification_tokens_identifier_token_key`(`identifier`, `token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Role` (
    `uuid` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE', 'DELETED', 'PENDING') NOT NULL,
    `date_created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `date_modified` DATETIME(3) NULL,
    `tags` VARCHAR(191) NULL,

    UNIQUE INDEX `Role_uuid_key`(`uuid`),
    UNIQUE INDEX `Role_name_key`(`name`),
    PRIMARY KEY (`uuid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Privilege` (
    `uuid` VARCHAR(191) NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `resource` VARCHAR(191) NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE', 'DELETED', 'PENDING') NOT NULL,
    `date_created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `date_modified` DATETIME(3) NULL,
    `role_uuid` VARCHAR(191) NOT NULL,

    INDEX `Privilege_role_uuid_idx`(`role_uuid`),
    PRIMARY KEY (`uuid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Token` (
    `uuid` VARCHAR(191) NOT NULL,
    `date_created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` ENUM('ACTIVE', 'EXPIRED', 'DELETED', 'PENDING') NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `role_uuid` VARCHAR(191) NULL,
    `user_id` VARCHAR(191) NULL,

    UNIQUE INDEX `Token_role_uuid_key`(`role_uuid`),
    UNIQUE INDEX `Token_user_id_key`(`user_id`),
    PRIMARY KEY (`uuid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `accounts` ADD CONSTRAINT `accounts_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `Role`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Privilege` ADD CONSTRAINT `Privilege_role_uuid_fkey` FOREIGN KEY (`role_uuid`) REFERENCES `Role`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Token` ADD CONSTRAINT `Token_role_uuid_fkey` FOREIGN KEY (`role_uuid`) REFERENCES `Role`(`uuid`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Token` ADD CONSTRAINT `Token_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
