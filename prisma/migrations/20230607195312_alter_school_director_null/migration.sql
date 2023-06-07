-- DropForeignKey
ALTER TABLE "schools" DROP CONSTRAINT "schools_director_id_fkey";

-- AddForeignKey
ALTER TABLE "schools" ADD CONSTRAINT "schools_director_id_fkey" FOREIGN KEY ("director_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
