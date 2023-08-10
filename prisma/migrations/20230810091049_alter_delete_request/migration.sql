-- DropForeignKey
ALTER TABLE "frequencies" DROP CONSTRAINT "frequencies_request_id_fkey";

-- DropForeignKey
ALTER TABLE "frequency_student" DROP CONSTRAINT "frequency_student_request_id_fkey";

-- AddForeignKey
ALTER TABLE "frequencies" ADD CONSTRAINT "frequencies_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "frequency_student" ADD CONSTRAINT "frequency_student_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;
