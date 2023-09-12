-- CreateTable
CREATE TABLE "abstracts" (
    "key" TEXT NOT NULL,
    "class_id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "year_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "frequencies" INTEGER NOT NULL DEFAULT 0,
    "absences" INTEGER NOT NULL DEFAULT 0,
    "infrequency" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "abstracts_pkey" PRIMARY KEY ("class_id","school_id","year_id","student_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "abstracts_key_key" ON "abstracts"("key");

-- AddForeignKey
ALTER TABLE "abstracts" ADD CONSTRAINT "abstracts_class_id_school_id_year_id_student_id_fkey" FOREIGN KEY ("class_id", "school_id", "year_id", "student_id") REFERENCES "class_student"("class_id", "school_id", "year_id", "student_id") ON DELETE CASCADE ON UPDATE CASCADE;
