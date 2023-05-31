import { IStudentUpdateRequest } from '../../interfaces';
import prisma from '../../prisma';

export const updateStudentService = async (
  { is_active, justify_disabled, name }: IStudentUpdateRequest,
  id: string,
) => {
  return await prisma.student.update({
    where: { id },
    data: { is_active, justify_disabled, name },
  });
};
