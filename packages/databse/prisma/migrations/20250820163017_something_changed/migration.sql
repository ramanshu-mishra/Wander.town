-- DropForeignKey
ALTER TABLE "public"."Maps" DROP CONSTRAINT "Maps_spaceId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Maps" ADD CONSTRAINT "Maps_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "public"."Spaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;
