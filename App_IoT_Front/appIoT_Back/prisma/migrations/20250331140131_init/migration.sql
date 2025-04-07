/*
  Warnings:

  - You are about to drop the column `securityA` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `securityQ` on the `user` table. All the data in the column will be lost.
  - Added the required column `date_birthday` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `securityA`,
    DROP COLUMN `securityQ`,
    ADD COLUMN `date_birthday` DATETIME(3) NOT NULL;
