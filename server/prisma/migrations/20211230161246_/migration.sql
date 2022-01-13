/*
  Warnings:

  - You are about to drop the column `commentId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Comment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_calling` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_postId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_replyToId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_userId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_commentId_fkey";

-- DropForeignKey
ALTER TABLE "_calling" DROP CONSTRAINT "_calling_A_fkey";

-- DropForeignKey
ALTER TABLE "_calling" DROP CONSTRAINT "_calling_B_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "commentId";

-- DropTable
DROP TABLE "Comment";

-- DropTable
DROP TABLE "_calling";
