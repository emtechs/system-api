import { AppError } from '../../errors';
import prisma from '../../prisma';
import { UserReturnSchema } from '../../schemas';

export const retrieveUserService = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new AppError('user not found', 404);
  }

  return UserReturnSchema.parse(user);
};
