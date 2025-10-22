/*
  Warnings:

  - A unique constraint covering the columns `[mapId,x,y]` on the table `MapElement` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `hostId` to the `Organisation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Organisation" ADD COLUMN     "hostId" TEXT NOT NULL,
ADD COLUMN     "parentOrgId" TEXT;

-- AlterTable
ALTER TABLE "public"."Space" ALTER COLUMN "orgId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "MapElement_mapId_x_y_key" ON "public"."MapElement"("mapId", "x", "y");

-- AddForeignKey
ALTER TABLE "public"."Organisation" ADD CONSTRAINT "Organisation_parentOrgId_fkey" FOREIGN KEY ("parentOrgId") REFERENCES "public"."Organisation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Organisation" ADD CONSTRAINT "Organisation_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
