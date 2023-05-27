import { IStudentQuery } from '../../interfaces';
import prisma from '../../prisma';
import { studentsParseFrequency } from '../../scripts';

export const listStudentService = async ({ school_year_id }: IStudentQuery) => {
  const students = await prisma.student.findMany({ orderBy: { name: 'asc' } });

  if (school_year_id) {
    return await studentsParseFrequency(students, school_year_id);
  }

  return students;
};
