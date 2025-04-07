/*
  Warnings:

  - You are about to alter the column `type` on the `Question` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(2))`.

*/
-- AlterTable
ALTER TABLE `Question` MODIFY `type` ENUM('FREE_RESPONSE') NOT NULL;
