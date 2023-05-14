-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SERV', 'DIRET', 'SECRET', 'ADMIN');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(254),
    "email" VARCHAR(254),
    "login" VARCHAR(128) NOT NULL,
    "password" VARCHAR(128) NOT NULL,
    "cpf" VARCHAR(14) NOT NULL,
    "phone" VARCHAR(15),
    "role" "Role" NOT NULL DEFAULT 'SERV',
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
    "user_id" TEXT,

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
CREATE UNIQUE INDEX "images_key_key" ON "images"("key");

-- CreateIndex
CREATE UNIQUE INDEX "images_user_id_key" ON "images"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "token_user_id_key" ON "token"("user_id");

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "token" ADD CONSTRAINT "token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
