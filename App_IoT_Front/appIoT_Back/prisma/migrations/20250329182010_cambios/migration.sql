/*
  Warnings:

  - You are about to alter the column `externalId` on the `plot` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `plot` MODIFY `externalId` INTEGER NOT NULL;
