import prisma from '../../prisma';

export const retrieveStudentService = async (id: string) => {
  return await prisma.student.findUnique({ where: { id } });
};
