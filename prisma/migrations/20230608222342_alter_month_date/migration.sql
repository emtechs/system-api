/*
  Warnings:

  - Made the column `date` on table `months` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "months" ALTER COLUMN "date" SET NOT NULL;
