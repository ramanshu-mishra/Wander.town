/*
  Warnings:

  - A unique constraint covering the columns `[userSpacesId]` on the table `Avatar` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[avatarId]` on the table `UserSpace` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userSpacesId` to the `Avatar` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."UserSpace" DROP CONSTRAINT "UserSpace_avatarId_fkey";

-- AlterTable
ALTER TABLE "public"."Avatar" ADD COLUMN     "userSpacesId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Avatar_userSpacesId_key" ON "public"."Avatar"("userSpacesId");

-- CreateIndex
CREATE UNIQUE INDEX "UserSpace_avatarId_key" ON "public"."UserSpace"("avatarId");

-- AddForeignKey
ALTER TABLE "public"."Avatar" ADD CONSTRAINT "Avatar_userSpacesId_fkey" FOREIGN KEY ("userSpacesId") REFERENCES "public"."UserSpace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
