/*
  Warnings:

  - You are about to drop the column `userid` on the `UserSpace` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,spaceId]` on the table `UserSpace` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `role` to the `UserSpace` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `UserSpace` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."UserSpace" DROP CONSTRAINT "UserSpace_userid_fkey";

-- DropIndex
DROP INDEX "public"."UserSpace_userid_spaceId_key";

-- AlterTable
ALTER TABLE "public"."Space" ADD COLUMN     "allowMemberInvite" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "public"."UserSpace" DROP COLUMN "userid",
ADD COLUMN     "role" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserSpace_userId_spaceId_key" ON "public"."UserSpace"("userId", "spaceId");

-- AddForeignKey
ALTER TABLE "public"."UserSpace" ADD CONSTRAINT "UserSpace_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
