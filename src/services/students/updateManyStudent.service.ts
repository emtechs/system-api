import { IStudentUpdateMany } from '../../interfaces';
import { updateStudent } from '../../scripts';

export const updateManyStudentService = async ({
  students,
}: IStudentUpdateMany) => {
  return await updateStudent(students);
};
