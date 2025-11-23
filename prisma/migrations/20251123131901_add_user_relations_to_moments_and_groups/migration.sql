/*
  Warnings:

  - A unique constraint covering the columns `[userId,name]` on the table `Group` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Group` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Moment` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Group_name_key` ON `Group`;

-- AlterTable
ALTER TABLE `Group` ADD COLUMN `userId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Moment` ADD COLUMN `userId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE INDEX `Group_userId_idx` ON `Group`(`userId`);

-- CreateIndex
CREATE UNIQUE INDEX `Group_userId_name_key` ON `Group`(`userId`, `name`);

-- CreateIndex
CREATE INDEX `Moment_userId_idx` ON `Moment`(`userId`);
