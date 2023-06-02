import prisma from '../../prisma';
import { AppError } from '../../errors';

export const deleteDirectorSchoolService = async (id: string) => {
  try {
    await prisma.school.update({
      where: { id },
      data: { director: { disconnect: true } },
    });
  } catch {
    throw new AppError('school not found', 404);
  }
};
