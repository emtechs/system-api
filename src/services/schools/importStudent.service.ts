import prisma from '../../prisma';
import { loadStudents } from '../../scripts';

export const importStudentService = async (
  file: Express.Multer.File,
  class_id: string,
  school_id: string,
) => {
  const data = await loadStudents(file, class_id, school_id);

  const students = await prisma.student.createMany({
    data,
  });

  return students;
};
