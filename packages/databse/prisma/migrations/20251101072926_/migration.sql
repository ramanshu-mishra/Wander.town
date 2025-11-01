/*
  Warnings:

  - A unique constraint covering the columns `[x,y]` on the table `spawnPoint` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "image" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "spawnPoint_x_y_key" ON "public"."spawnPoint"("x", "y");
