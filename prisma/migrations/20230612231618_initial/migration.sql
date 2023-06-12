/*
  Warnings:

  - Made the column `date_time` on table `frequencies` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "frequencies" ALTER COLUMN "date_time" SET NOT NULL;
