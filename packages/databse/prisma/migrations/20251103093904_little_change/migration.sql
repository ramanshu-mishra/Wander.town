/*
  Warnings:

  - You are about to drop the column `userSpacesId` on the `Avatar` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Avatar" DROP CONSTRAINT "Avatar_userSpacesId_fkey";

-- DropIndex
DROP INDEX "public"."Avatar_userSpacesId_key";

-- AlterTable
ALTER TABLE "public"."Avatar" DROP COLUMN "userSpacesId";

-- AddForeignKey
ALTER TABLE "public"."UserSpace" ADD CONSTRAINT "UserSpace_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES "public"."Avatar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
