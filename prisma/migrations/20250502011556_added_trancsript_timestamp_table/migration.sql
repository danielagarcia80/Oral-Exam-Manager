-- CreateTable
CREATE TABLE `TranscriptSegment` (
    `segment_id` VARCHAR(191) NOT NULL,
    `submission_id` VARCHAR(191) NOT NULL,
    `start_seconds` DOUBLE NOT NULL,
    `end_seconds` DOUBLE NOT NULL,
    `text` VARCHAR(191) NOT NULL,

    INDEX `TranscriptSegment_submission_id_idx`(`submission_id`),
    PRIMARY KEY (`segment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TranscriptSegment` ADD CONSTRAINT `TranscriptSegment_submission_id_fkey` FOREIGN KEY (`submission_id`) REFERENCES `ExamSubmission`(`submission_id`) ON DELETE CASCADE ON UPDATE CASCADE;
