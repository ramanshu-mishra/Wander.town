/*
  Warnings:

  - Added the required column `avatarId` to the `UserSpace` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."UserSpace" DROP CONSTRAINT "UserSpace_spaceId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserSpace" DROP CONSTRAINT "UserSpace_userid_fkey";

-- AlterTable
ALTER TABLE "public"."UserSpace" ADD COLUMN     "avatarId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."UserSpace" ADD CONSTRAINT "UserSpace_userid_fkey" FOREIGN KEY ("userid") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserSpace" ADD CONSTRAINT "UserSpace_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "public"."Space"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserSpace" ADD CONSTRAINT "UserSpace_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES "public"."Avatar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
