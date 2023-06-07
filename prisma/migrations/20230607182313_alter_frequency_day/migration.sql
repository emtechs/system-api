/*
  Warnings:

  - Added the required column `day_id` to the `frequencies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "frequencies" ADD COLUMN     "day_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "days" (
    "id" TEXT NOT NULL,
    "day" INTEGER NOT NULL,

    CONSTRAINT "days_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "days_day_key" ON "days"("day");

-- AddForeignKey
ALTER TABLE "frequencies" ADD CONSTRAINT "frequencies_day_id_fkey" FOREIGN KEY ("day_id") REFERENCES "days"("id") ON DELETE CASCADE ON UPDATE CASCADE;
