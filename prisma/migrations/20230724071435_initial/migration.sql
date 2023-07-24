-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SERV', 'DIRET', 'SECRET', 'ADMIN');

-- CreateEnum
CREATE TYPE "Dash" AS ENUM ('COMMON', 'SCHOOL', 'ORGAN', 'ADMIN');

-- CreateEnum
CREATE TYPE "StatusFrequency" AS ENUM ('OPENED', 'CLOSED');

-- CreateEnum
CREATE TYPE "StatusStudent" AS ENUM ('PRESENTED', 'MISSED', 'JUSTIFIED');

-- CreateEnum
CREATE TYPE "SortFrequencyHistory" AS ENUM ('RELEASED', 'CHANGED', 'APPROVED');

-- CreateEnum
CREATE TYPE "StatusFrequencyHistory" AS ENUM ('ACCEPTED', 'IN_ANALYSIS', 'REFUSED');

-- CreateEnum
CREATE TYPE "CategoryPeriod" AS ENUM ('BIMESTRE', 'SEMESTRE', 'ANO');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(254) NOT NULL,
    "email" VARCHAR(254),
    "login" VARCHAR(128) NOT NULL,
    "password" VARCHAR(128) NOT NULL,
    "cpf" VARCHAR(14) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'SERV',
    "dash" "Dash" NOT NULL DEFAULT 'COMMON',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_first_access" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schools" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(254) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "director_id" TEXT,

    CONSTRAINT "schools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "classes" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(254) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "students" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(254) NOT NULL,
    "registry" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "frequencies" (
    "id" TEXT NOT NULL,
    "date" VARCHAR(50) NOT NULL,
    "date_time" DATE NOT NULL,
    "status" "StatusFrequency" NOT NULL DEFAULT 'OPENED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finished_at" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "infrequency" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "month_id" TEXT NOT NULL,
    "class_id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "year_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "frequencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "years" (
    "id" TEXT NOT NULL,
    "year" VARCHAR(10) NOT NULL,

    CONSTRAINT "years_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "months" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "month" INTEGER NOT NULL,

    CONSTRAINT "months_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "periods" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "category" "CategoryPeriod" NOT NULL,
    "date_initial" DATE NOT NULL,
    "date_final" DATE NOT NULL,
    "year_id" TEXT NOT NULL,

    CONSTRAINT "periods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "school_server" (
    "key" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "server_id" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'SERV',
    "dash" "Dash" NOT NULL DEFAULT 'COMMON',

    CONSTRAINT "school_server_pkey" PRIMARY KEY ("school_id","server_id")
);

-- CreateTable
CREATE TABLE "class_year" (
    "key" TEXT NOT NULL,
    "class_id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "year_id" TEXT NOT NULL,

    CONSTRAINT "class_year_pkey" PRIMARY KEY ("class_id","school_id","year_id")
);

-- CreateTable
CREATE TABLE "class_student" (
    "key" TEXT NOT NULL,
    "class_id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "year_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,

    CONSTRAINT "class_student_pkey" PRIMARY KEY ("class_id","school_id","year_id","student_id")
);

-- CreateTable
CREATE TABLE "class_student_history" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "class_id" TEXT,
    "student_id" TEXT NOT NULL,

    CONSTRAINT "class_student_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "frequency_period" (
    "key" TEXT NOT NULL,
    "period_id" TEXT NOT NULL,
    "frequency_id" TEXT NOT NULL,

    CONSTRAINT "frequency_period_pkey" PRIMARY KEY ("period_id","frequency_id")
);

-- CreateTable
CREATE TABLE "frequency_student" (
    "id" TEXT NOT NULL,
    "status" "StatusStudent" NOT NULL DEFAULT 'PRESENTED',
    "value" INTEGER NOT NULL DEFAULT 0,
    "justification" TEXT,
    "updated_at" VARCHAR(200),
    "frequency_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,

    CONSTRAINT "frequency_student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "frequency_history" (
    "id" TEXT NOT NULL,
    "sort" "SortFrequencyHistory" NOT NULL DEFAULT 'RELEASED',
    "status" "StatusFrequencyHistory" NOT NULL DEFAULT 'IN_ANALYSIS',
    "status_student" "StatusStudent" NOT NULL,
    "justification" TEXT,
    "created_at" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "frequency_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "frequency_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "school_infrequency" (
    "key" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "frequencies" INTEGER NOT NULL DEFAULT 0,
    "period_id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,

    CONSTRAINT "school_infrequency_pkey" PRIMARY KEY ("period_id","school_id")
);

-- CreateTable
CREATE TABLE "class_year_infrequency" (
    "key" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "frequencies" INTEGER NOT NULL DEFAULT 0,
    "period_id" TEXT NOT NULL,
    "class_id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "year_id" TEXT NOT NULL,

    CONSTRAINT "class_year_infrequency_pkey" PRIMARY KEY ("period_id","class_id","school_id","year_id")
);

-- CreateTable
CREATE TABLE "student_infrequency" (
    "key" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "presences" INTEGER NOT NULL DEFAULT 0,
    "justified" INTEGER NOT NULL DEFAULT 0,
    "absences" INTEGER NOT NULL DEFAULT 0,
    "frequencies" INTEGER NOT NULL DEFAULT 0,
    "period_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,

    CONSTRAINT "student_infrequency_pkey" PRIMARY KEY ("period_id","student_id")
);

-- CreateTable
CREATE TABLE "images" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "size" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "key" VARCHAR(200) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "token" (
    "id" TEXT NOT NULL,
    "token" VARCHAR(200) NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_login_key" ON "users"("login");

-- CreateIndex
CREATE UNIQUE INDEX "users_cpf_key" ON "users"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "schools_name_key" ON "schools"("name");

-- CreateIndex
CREATE UNIQUE INDEX "classes_name_key" ON "classes"("name");

-- CreateIndex
CREATE UNIQUE INDEX "students_registry_key" ON "students"("registry");

-- CreateIndex
CREATE UNIQUE INDEX "years_year_key" ON "years"("year");

-- CreateIndex
CREATE UNIQUE INDEX "months_name_key" ON "months"("name");

-- CreateIndex
CREATE UNIQUE INDEX "months_month_key" ON "months"("month");

-- CreateIndex
CREATE UNIQUE INDEX "school_server_key_key" ON "school_server"("key");

-- CreateIndex
CREATE UNIQUE INDEX "class_year_key_key" ON "class_year"("key");

-- CreateIndex
CREATE UNIQUE INDEX "class_student_key_key" ON "class_student"("key");

-- CreateIndex
CREATE UNIQUE INDEX "frequency_period_key_key" ON "frequency_period"("key");

-- CreateIndex
CREATE UNIQUE INDEX "school_infrequency_key_key" ON "school_infrequency"("key");

-- CreateIndex
CREATE UNIQUE INDEX "class_year_infrequency_key_key" ON "class_year_infrequency"("key");

-- CreateIndex
CREATE UNIQUE INDEX "student_infrequency_key_key" ON "student_infrequency"("key");

-- CreateIndex
CREATE UNIQUE INDEX "images_key_key" ON "images"("key");

-- CreateIndex
CREATE UNIQUE INDEX "images_user_id_key" ON "images"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "token_user_id_key" ON "token"("user_id");

-- AddForeignKey
ALTER TABLE "schools" ADD CONSTRAINT "schools_director_id_fkey" FOREIGN KEY ("director_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "frequencies" ADD CONSTRAINT "frequencies_month_id_fkey" FOREIGN KEY ("month_id") REFERENCES "months"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "frequencies" ADD CONSTRAINT "frequencies_class_id_school_id_year_id_fkey" FOREIGN KEY ("class_id", "school_id", "year_id") REFERENCES "class_year"("class_id", "school_id", "year_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "frequencies" ADD CONSTRAINT "frequencies_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "periods" ADD CONSTRAINT "periods_year_id_fkey" FOREIGN KEY ("year_id") REFERENCES "years"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "school_server" ADD CONSTRAINT "school_server_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "school_server" ADD CONSTRAINT "school_server_server_id_fkey" FOREIGN KEY ("server_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_year" ADD CONSTRAINT "class_year_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_year" ADD CONSTRAINT "class_year_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_year" ADD CONSTRAINT "class_year_year_id_fkey" FOREIGN KEY ("year_id") REFERENCES "years"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_student" ADD CONSTRAINT "class_student_class_id_school_id_year_id_fkey" FOREIGN KEY ("class_id", "school_id", "year_id") REFERENCES "class_year"("class_id", "school_id", "year_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_student" ADD CONSTRAINT "class_student_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_student_history" ADD CONSTRAINT "class_student_history_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "class_student"("key") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_student_history" ADD CONSTRAINT "class_student_history_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "frequency_period" ADD CONSTRAINT "frequency_period_period_id_fkey" FOREIGN KEY ("period_id") REFERENCES "periods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "frequency_period" ADD CONSTRAINT "frequency_period_frequency_id_fkey" FOREIGN KEY ("frequency_id") REFERENCES "frequencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "frequency_student" ADD CONSTRAINT "frequency_student_frequency_id_fkey" FOREIGN KEY ("frequency_id") REFERENCES "frequencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "frequency_student" ADD CONSTRAINT "frequency_student_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "frequency_history" ADD CONSTRAINT "frequency_history_frequency_id_fkey" FOREIGN KEY ("frequency_id") REFERENCES "frequency_student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "frequency_history" ADD CONSTRAINT "frequency_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "school_infrequency" ADD CONSTRAINT "school_infrequency_period_id_fkey" FOREIGN KEY ("period_id") REFERENCES "periods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "school_infrequency" ADD CONSTRAINT "school_infrequency_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_year_infrequency" ADD CONSTRAINT "class_year_infrequency_period_id_fkey" FOREIGN KEY ("period_id") REFERENCES "periods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_year_infrequency" ADD CONSTRAINT "class_year_infrequency_class_id_school_id_year_id_fkey" FOREIGN KEY ("class_id", "school_id", "year_id") REFERENCES "class_year"("class_id", "school_id", "year_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_infrequency" ADD CONSTRAINT "student_infrequency_period_id_fkey" FOREIGN KEY ("period_id") REFERENCES "periods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_infrequency" ADD CONSTRAINT "student_infrequency_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "token" ADD CONSTRAINT "token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
