import prisma from '../../prisma';
import { AppError } from '../../errors';

export const deleteUserService = async (id: string) => {
  try {
    await prisma.user.update({
      where: { id },
      data: { is_active: false },
    });
  } catch {
    throw new AppError('user not found', 404);
  }
};
