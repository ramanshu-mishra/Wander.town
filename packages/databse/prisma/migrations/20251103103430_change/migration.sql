/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `DefaultMap` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[type,variant]` on the table `Element` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DefaultMap_name_key" ON "public"."DefaultMap"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Element_type_variant_key" ON "public"."Element"("type", "variant");
