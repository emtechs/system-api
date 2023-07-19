import { IDeleteClassStudentRequest } from '../../interfaces';
import prisma from '../../prisma';

export const deleteClassStudentService = async (
  { finished_at, justify_disabled }: IDeleteClassStudentRequest,
  key: string,
) => {
  const classData = await prisma.classStudent.update({
    where: { key },
    data: { is_active: false, finished_at, justify_disabled },
  });

  return classData;
};
