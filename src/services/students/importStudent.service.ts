import { importStudent, loadStudents } from '../../scripts';

export const importStudentService = async (
  file: Express.Multer.File,
  class_id: string,
  school_id: string,
  school_year_id: string,
) => {
  const students = await loadStudents(
    file,
    class_id,
    school_id,
    school_year_id,
  );

  return await importStudent(students);
};