import prisma from '../../prisma';
import { ClassArraySchema } from '../../schemas';

export const listStudentService = async () => {
  const students = await prisma.student.findMany({});
  return students;
};
