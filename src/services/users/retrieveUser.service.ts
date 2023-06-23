import { AppError } from '../../errors';
import prisma from '../../prisma';
import { UserReturnSchema } from '../../schemas';

export const retrieveUserService = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      director_school: true,
      work_school: {
        include: {
          school: true,
        },
      },
    },
  });

  if (!user) throw new AppError('user not found', 404);

  return UserReturnSchema.parse(user);
};
