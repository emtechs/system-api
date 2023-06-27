-- CreateEnum
CREATE TYPE "NamePeriod" AS ENUM ('BIMESTRE', 'SEMESTRE');

-- CreateTable
CREATE TABLE "periods" (
    "id" TEXT NOT NULL,
    "name" "NamePeriod" NOT NULL,
    "description" VARCHAR(50) NOT NULL,

    CONSTRAINT "periods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MonthToPeriod" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "periods_description_key" ON "periods"("description");

-- CreateIndex
CREATE UNIQUE INDEX "_MonthToPeriod_AB_unique" ON "_MonthToPeriod"("A", "B");

-- CreateIndex
CREATE INDEX "_MonthToPeriod_B_index" ON "_MonthToPeriod"("B");

-- AddForeignKey
ALTER TABLE "_MonthToPeriod" ADD CONSTRAINT "_MonthToPeriod_A_fkey" FOREIGN KEY ("A") REFERENCES "months"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MonthToPeriod" ADD CONSTRAINT "_MonthToPeriod_B_fkey" FOREIGN KEY ("B") REFERENCES "periods"("id") ON DELETE CASCADE ON UPDATE CASCADE;
