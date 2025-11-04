/*
  Warnings:

  - Added the required column `invitePrivilege` to the `UserSpace` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."UserSpace" ADD COLUMN     "invitePrivilege" BOOLEAN NOT NULL;
