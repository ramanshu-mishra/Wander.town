/*
  Warnings:

  - Added the required column `image` to the `Beard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Image` to the `Color` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `Eyes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `Mustache` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `Pants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `Shirts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Maps" DROP CONSTRAINT "Maps_spaceId_fkey";

-- AlterTable
ALTER TABLE "public"."Beard" ADD COLUMN     "image" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Color" ADD COLUMN     "Image" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Eyes" ADD COLUMN     "image" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Maps" ALTER COLUMN "spaceId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Mustache" ADD COLUMN     "image" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Pants" ADD COLUMN     "image" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Shirts" ADD COLUMN     "image" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Maps" ADD CONSTRAINT "Maps_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "public"."Spaces"("id") ON DELETE SET NULL ON UPDATE CASCADE;
