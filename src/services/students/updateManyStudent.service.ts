import { IStudentUpdateMany } from '../../interfaces';
import { updateStudent } from '../../scripts';

export const updateManyStudentService = async (
  { students }: IStudentUpdateMany,
  year_id: string,
) => {
  return await updateStudent(students, year_id);
};
