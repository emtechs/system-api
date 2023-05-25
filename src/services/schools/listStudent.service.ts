import prisma from '../../prisma';
import { studentsParseFrequency } from '../../scripts';

export const listStudentService = async () => {
  const students = await prisma.student.findMany({ orderBy: { name: 'asc' } });

  return await studentsParseFrequency(students);
};
