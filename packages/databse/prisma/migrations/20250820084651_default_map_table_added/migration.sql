/*
  Warnings:

  - Added the required column `image` to the `Maps` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Maps" ADD COLUMN     "image" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "public"."DefaultMaps" (
    "id" TEXT NOT NULL,
    "height" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "DefaultMaps_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DefaultMaps_id_key" ON "public"."DefaultMaps"("id");
