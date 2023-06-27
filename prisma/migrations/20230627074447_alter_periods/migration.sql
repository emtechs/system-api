/*
  Warnings:

  - The primary key for the `periods` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `periods` table. All the data in the column will be lost.
  - You are about to drop the `_MonthToPeriod` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `month_id` to the `periods` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year_id` to the `periods` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_MonthToPeriod" DROP CONSTRAINT "_MonthToPeriod_A_fkey";

-- DropForeignKey
ALTER TABLE "_MonthToPeriod" DROP CONSTRAINT "_MonthToPeriod_B_fkey";

-- DropIndex
DROP INDEX "periods_description_key";

-- AlterTable
ALTER TABLE "periods" DROP CONSTRAINT "periods_pkey",
DROP COLUMN "id",
ADD COLUMN     "month_id" TEXT NOT NULL,
ADD COLUMN     "year_id" TEXT NOT NULL,
ADD CONSTRAINT "periods_pkey" PRIMARY KEY ("month_id", "year_id");

-- DropTable
DROP TABLE "_MonthToPeriod";

-- AddForeignKey
ALTER TABLE "periods" ADD CONSTRAINT "periods_month_id_fkey" FOREIGN KEY ("month_id") REFERENCES "months"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "periods" ADD CONSTRAINT "periods_year_id_fkey" FOREIGN KEY ("year_id") REFERENCES "years"("id") ON DELETE CASCADE ON UPDATE CASCADE;
