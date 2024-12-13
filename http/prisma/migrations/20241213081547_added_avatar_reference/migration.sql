/*
  Warnings:

  - You are about to drop the column `userId` on the `Avatar` table. All the data in the column will be lost.
  - Made the column `avatarId` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Avatar" DROP CONSTRAINT "Avatar_userId_fkey";

-- AlterTable
ALTER TABLE "Avatar" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "avatarId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES "Avatar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
