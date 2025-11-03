/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Avatar` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Avatar" ALTER COLUMN "name" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "Avatar_name_key" ON "public"."Avatar"("name");
