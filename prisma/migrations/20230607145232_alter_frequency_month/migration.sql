/*
  Warnings:

  - You are about to drop the column `month` on the `frequencies` table. All the data in the column will be lost.
  - Added the required column `month_id` to the `frequencies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "frequencies" DROP COLUMN "month",
ADD COLUMN     "month_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "months" (
    "id" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "months_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "months_month_key" ON "months"("month");

-- CreateIndex
CREATE UNIQUE INDEX "months_name_key" ON "months"("name");

-- AddForeignKey
ALTER TABLE "frequencies" ADD CONSTRAINT "frequencies_month_id_fkey" FOREIGN KEY ("month_id") REFERENCES "months"("id") ON DELETE CASCADE ON UPDATE CASCADE;
