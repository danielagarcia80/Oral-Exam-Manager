-- DropIndex
DROP INDEX `Account_provider_providerAccountId_key` ON `Account`;

-- AlterTable
ALTER TABLE `Account` ADD COLUMN `scope` VARCHAR(191) NULL;
