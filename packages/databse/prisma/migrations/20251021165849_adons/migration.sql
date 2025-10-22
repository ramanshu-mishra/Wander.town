/*
  Warnings:

  - Added the required column `thumbnail` to the `DefaultMap` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mapId` to the `Space` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."DefaultMap" ADD COLUMN     "thumbnail" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Space" ADD COLUMN     "mapId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Space" ADD CONSTRAINT "Space_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES "public"."Map"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
