/*
  Warnings:

  - A unique constraint covering the columns `[spaceId]` on the table `Maps` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[map_id]` on the table `Spaces` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `thumbnail` to the `DefaultMaps` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spaceId` to the `Maps` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thumbnail` to the `Maps` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."DefaultMaps" ADD COLUMN     "thumbnail" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Maps" ADD COLUMN     "spaceId" TEXT NOT NULL,
ADD COLUMN     "thumbnail" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Maps_spaceId_key" ON "public"."Maps"("spaceId");

-- CreateIndex
CREATE UNIQUE INDEX "Spaces_map_id_key" ON "public"."Spaces"("map_id");

-- AddForeignKey
ALTER TABLE "public"."Maps" ADD CONSTRAINT "Maps_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "public"."Spaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
