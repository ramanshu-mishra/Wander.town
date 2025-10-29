-- CreateTable
CREATE TABLE "public"."spawnPoint" (
    "id" TEXT NOT NULL,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,

    CONSTRAINT "spawnPoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_spawnPoints" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_spawnPoints_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "spawnPoint_id_key" ON "public"."spawnPoint"("id");

-- CreateIndex
CREATE INDEX "_spawnPoints_B_index" ON "public"."_spawnPoints"("B");

-- AddForeignKey
ALTER TABLE "public"."_spawnPoints" ADD CONSTRAINT "_spawnPoints_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Map"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_spawnPoints" ADD CONSTRAINT "_spawnPoints_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."spawnPoint"("id") ON DELETE CASCADE ON UPDATE CASCADE;
