-- CreateTable
CREATE TABLE `CourseMembership` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `courseId` VARCHAR(191) NOT NULL,
    `role` ENUM('INSTRUCTOR', 'STUDENT', 'TA', 'OBSERVER') NOT NULL,

    UNIQUE INDEX `CourseMembership_userId_courseId_key`(`userId`, `courseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CourseMembership` ADD CONSTRAINT `CourseMembership_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CourseMembership` ADD CONSTRAINT `CourseMembership_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`course_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
