-- CreateTable
CREATE TABLE `PendingCourseMembership` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `courseId` VARCHAR(191) NOT NULL,
    `role` ENUM('INSTRUCTOR', 'STUDENT', 'TA', 'OBSERVER') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `PendingCourseMembership_email_idx`(`email`),
    UNIQUE INDEX `PendingCourseMembership_email_courseId_key`(`email`, `courseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PendingCourseMembership` ADD CONSTRAINT `PendingCourseMembership_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`course_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
