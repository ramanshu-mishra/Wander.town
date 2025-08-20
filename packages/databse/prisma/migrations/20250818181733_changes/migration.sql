-- CreateTable
CREATE TABLE "public"."Session" (
    "sessionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("sessionId")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatarId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Avatar" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'default',
    "hairId" TEXT NOT NULL,
    "eyesId" TEXT NOT NULL,
    "shirtId" TEXT NOT NULL,
    "pantsId" TEXT NOT NULL,
    "mustacheId" TEXT NOT NULL,
    "beardId" TEXT NOT NULL,

    CONSTRAINT "Avatar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Spaces" (
    "id" TEXT NOT NULL,
    "map_id" TEXT NOT NULL,
    "host_id" TEXT NOT NULL,

    CONSTRAINT "Spaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Maps" (
    "id" TEXT NOT NULL,
    "height" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,

    CONSTRAINT "Maps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MapElements" (
    "id" TEXT NOT NULL,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "elementid" TEXT NOT NULL,
    "mapid" TEXT NOT NULL,

    CONSTRAINT "MapElements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Elements" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "height" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "Elements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Hair" (
    "id" TEXT NOT NULL,
    "colorId" TEXT NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "Hair_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Color" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Color_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Beard" (
    "id" TEXT NOT NULL,
    "hairId" TEXT NOT NULL,
    "colorId" TEXT NOT NULL,

    CONSTRAINT "Beard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Mustache" (
    "id" TEXT NOT NULL,
    "colorId" TEXT NOT NULL,

    CONSTRAINT "Mustache_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Shirts" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Shirts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Pants" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Pants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Eyes" (
    "id" TEXT NOT NULL,
    "colorId" TEXT NOT NULL,

    CONSTRAINT "Eyes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_cohostSpaces" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_cohostSpaces_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_memberSpaces" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_memberSpaces_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "public"."User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Avatar_id_key" ON "public"."Avatar"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Spaces_id_key" ON "public"."Spaces"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Maps_id_key" ON "public"."Maps"("id");

-- CreateIndex
CREATE UNIQUE INDEX "MapElements_id_key" ON "public"."MapElements"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Elements_id_key" ON "public"."Elements"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Hair_id_key" ON "public"."Hair"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Color_id_key" ON "public"."Color"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Beard_id_key" ON "public"."Beard"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Mustache_id_key" ON "public"."Mustache"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Shirts_id_key" ON "public"."Shirts"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Pants_id_key" ON "public"."Pants"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Eyes_id_key" ON "public"."Eyes"("id");

-- CreateIndex
CREATE INDEX "_cohostSpaces_B_index" ON "public"."_cohostSpaces"("B");

-- CreateIndex
CREATE INDEX "_memberSpaces_B_index" ON "public"."_memberSpaces"("B");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES "public"."Avatar"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Avatar" ADD CONSTRAINT "Avatar_hairId_fkey" FOREIGN KEY ("hairId") REFERENCES "public"."Hair"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Avatar" ADD CONSTRAINT "Avatar_beardId_fkey" FOREIGN KEY ("beardId") REFERENCES "public"."Beard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Avatar" ADD CONSTRAINT "Avatar_eyesId_fkey" FOREIGN KEY ("eyesId") REFERENCES "public"."Eyes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Avatar" ADD CONSTRAINT "Avatar_shirtId_fkey" FOREIGN KEY ("shirtId") REFERENCES "public"."Shirts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Avatar" ADD CONSTRAINT "Avatar_pantsId_fkey" FOREIGN KEY ("pantsId") REFERENCES "public"."Pants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Avatar" ADD CONSTRAINT "Avatar_mustacheId_fkey" FOREIGN KEY ("mustacheId") REFERENCES "public"."Mustache"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Spaces" ADD CONSTRAINT "Spaces_host_id_fkey" FOREIGN KEY ("host_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MapElements" ADD CONSTRAINT "MapElements_mapid_fkey" FOREIGN KEY ("mapid") REFERENCES "public"."Maps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MapElements" ADD CONSTRAINT "MapElements_elementid_fkey" FOREIGN KEY ("elementid") REFERENCES "public"."Elements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_cohostSpaces" ADD CONSTRAINT "_cohostSpaces_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Spaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_cohostSpaces" ADD CONSTRAINT "_cohostSpaces_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_memberSpaces" ADD CONSTRAINT "_memberSpaces_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Spaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_memberSpaces" ADD CONSTRAINT "_memberSpaces_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
