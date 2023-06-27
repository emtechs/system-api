/*
  Warnings:

  - You are about to drop the `semesters` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `two_months` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "CategoryPeriod" AS ENUM ('BIMESTRE', 'SEMESTRE');

-- DropForeignKey
ALTER TABLE "semesters" DROP CONSTRAINT "semesters_month_id_fkey";

-- DropForeignKey
ALTER TABLE "semesters" DROP CONSTRAINT "semesters_year_id_fkey";

-- DropForeignKey
ALTER TABLE "two_months" DROP CONSTRAINT "two_months_month_id_fkey";

-- DropForeignKey
ALTER TABLE "two_months" DROP CONSTRAINT "two_months_year_id_fkey";

-- DropTable
DROP TABLE "semesters";

-- DropTable
DROP TABLE "two_months";

-- CreateTable
CREATE TABLE "periods" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "category" "CategoryPeriod" NOT NULL,

    CONSTRAINT "periods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "month_period" (
    "month_id" TEXT NOT NULL,
    "year_id" TEXT NOT NULL,
    "period_id" TEXT NOT NULL,

    CONSTRAINT "month_period_pkey" PRIMARY KEY ("month_id","year_id","period_id")
);

-- AddForeignKey
ALTER TABLE "month_period" ADD CONSTRAINT "month_period_month_id_fkey" FOREIGN KEY ("month_id") REFERENCES "months"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "month_period" ADD CONSTRAINT "month_period_year_id_fkey" FOREIGN KEY ("year_id") REFERENCES "years"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "month_period" ADD CONSTRAINT "month_period_period_id_fkey" FOREIGN KEY ("period_id") REFERENCES "periods"("id") ON DELETE CASCADE ON UPDATE CASCADE;
