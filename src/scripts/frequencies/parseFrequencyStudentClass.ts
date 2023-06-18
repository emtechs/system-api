import { ClassStudent, Student } from '@prisma/client';
import { parseFrequency } from './calculateFrequency';

export const studentClassParseFrequency = async (
  students: (ClassStudent & {
    student: Student;
  })[],
  year_id: string,
) => {
  const studentsWithFrequency = students.map((el) => {
    return parseFrequency(el.student_id, year_id);
  });

  return Promise.all(studentsWithFrequency).then((studentFrequency) => {
    return studentFrequency;
  });
};
