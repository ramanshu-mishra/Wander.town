/*
  Warnings:

  - You are about to drop the column `mapId` on the `Space` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[spaceId]` on the table `Map` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `spaceId` to the `Map` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Space" DROP CONSTRAINT "Space_mapId_fkey";

-- AlterTable
ALTER TABLE "public"."Map" ADD COLUMN     "spaceId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Space" DROP COLUMN "mapId";

-- CreateIndex
CREATE UNIQUE INDEX "Map_spaceId_key" ON "public"."Map"("spaceId");

-- AddForeignKey
ALTER TABLE "public"."Map" ADD CONSTRAINT "Map_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "public"."Space"("id") ON DELETE CASCADE ON UPDATE CASCADE;
