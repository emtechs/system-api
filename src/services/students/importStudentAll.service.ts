import { importStudent, loadStudentsAll } from '../../scripts';

export const importStudentAllService = async (file: Express.Multer.File) => {
  const students = await loadStudentsAll(file);

  return await importStudent(students);
};
