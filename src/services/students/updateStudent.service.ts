import { IStudentUpdateRequest } from '../../interfaces';
import prisma from '../../prisma';

export const updateStudentService = async (
  { name }: IStudentUpdateRequest,
  id: string,
) => {
  return await prisma.student.update({
    where: { id },
    data: { name },
  });
};
