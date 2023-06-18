import { Student } from '@prisma/client';
import { parseFrequency } from './calculateFrequency';

export const studentsParseFrequency = async (
  students: Student[],
  year_id: string,
) => {
  const studentsWithFrequency = students.map((el) => {
    return parseFrequency(el.id, year_id);
  });

  return Promise.all(studentsWithFrequency).then((studentFrequency) => {
    return studentFrequency;
  });
};
