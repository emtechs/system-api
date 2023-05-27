-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SERV', 'DIRET', 'SECRET', 'ADMIN');

-- CreateEnum
CREATE TYPE "Dash" AS ENUM ('COMMON', 'SCHOOL', 'ORGAN', 'ADMIN');

-- CreateEnum
CREATE TYPE "StatusFrequency" AS ENUM ('OPENED', 'CLOSED');

-- CreateEnum
CREATE TYPE "StatusStudent" AS ENUM ('PRESENTED', 'MISSED', 'JUSTIFIED');

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
    "is_first_access" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
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

-- CreateTable
CREATE TABLE "schools" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(254) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "director_id" TEXT,
    "school_infreq" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "schools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "school_server" (
    "school_id" TEXT NOT NULL,
    "server_id" TEXT NOT NULL,
    "dash" "Dash" NOT NULL DEFAULT 'COMMON',

    CONSTRAINT "school_server_pkey" PRIMARY KEY ("school_id","server_id")
);

-- CreateTable
CREATE TABLE "SchoolYear" (
    "id" TEXT NOT NULL,
    "year" VARCHAR(10) NOT NULL,

    CONSTRAINT "SchoolYear_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "class_school" (
    "class_id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "school_year_id" TEXT NOT NULL,
    "class_infreq" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "class_school_pkey" PRIMARY KEY ("class_id","school_id","school_year_id")
);

-- CreateTable
CREATE TABLE "frequencies" (
    "id" TEXT NOT NULL,
    "date" VARCHAR(50) NOT NULL,
    "status" "StatusFrequency" NOT NULL DEFAULT 'OPENED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finished_at" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "class_id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "school_year_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "frequencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "students" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(254) NOT NULL,
    "registry" VARCHAR(50) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "justify_disabled" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "class_student" (
    "class_id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "school_year_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,

    CONSTRAINT "class_student_pkey" PRIMARY KEY ("class_id","school_id","school_year_id","student_id")
);

-- CreateTable
CREATE TABLE "frequency_student" (
    "id" TEXT NOT NULL,
    "status" "StatusStudent" NOT NULL DEFAULT 'PRESENTED',
    "justification" TEXT,
    "updated_at" VARCHAR(200),
    "frequency_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,

    CONSTRAINT "frequency_student_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_login_key" ON "users"("login");

-- CreateIndex
CREATE UNIQUE INDEX "users_cpf_key" ON "users"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "images_key_key" ON "images"("key");

-- CreateIndex
CREATE UNIQUE INDEX "images_user_id_key" ON "images"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "token_user_id_key" ON "token"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "schools_name_key" ON "schools"("name");

-- CreateIndex
CREATE UNIQUE INDEX "schools_director_id_key" ON "schools"("director_id");

-- CreateIndex
CREATE UNIQUE INDEX "SchoolYear_year_key" ON "SchoolYear"("year");

-- CreateIndex
CREATE UNIQUE INDEX "classes_name_key" ON "classes"("name");

-- CreateIndex
CREATE UNIQUE INDEX "students_registry_key" ON "students"("registry");

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "token" ADD CONSTRAINT "token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schools" ADD CONSTRAINT "schools_director_id_fkey" FOREIGN KEY ("director_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "school_server" ADD CONSTRAINT "school_server_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "school_server" ADD CONSTRAINT "school_server_server_id_fkey" FOREIGN KEY ("server_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_school" ADD CONSTRAINT "class_school_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_school" ADD CONSTRAINT "class_school_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_school" ADD CONSTRAINT "class_school_school_year_id_fkey" FOREIGN KEY ("school_year_id") REFERENCES "SchoolYear"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "frequencies" ADD CONSTRAINT "frequencies_class_id_school_id_school_year_id_fkey" FOREIGN KEY ("class_id", "school_id", "school_year_id") REFERENCES "class_school"("class_id", "school_id", "school_year_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "frequencies" ADD CONSTRAINT "frequencies_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_student" ADD CONSTRAINT "class_student_class_id_school_id_school_year_id_fkey" FOREIGN KEY ("class_id", "school_id", "school_year_id") REFERENCES "class_school"("class_id", "school_id", "school_year_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_student" ADD CONSTRAINT "class_student_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "frequency_student" ADD CONSTRAINT "frequency_student_frequency_id_fkey" FOREIGN KEY ("frequency_id") REFERENCES "frequencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "frequency_student" ADD CONSTRAINT "frequency_student_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;
