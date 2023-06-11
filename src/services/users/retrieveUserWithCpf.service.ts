import { AppError } from '../../errors';
import { IUserQuery } from '../../interfaces';
import prisma from '../../prisma';
import { UserReturnSchema } from '../../schemas';

export const retrieveUserWithCpfService = async (
  login: string,
  { school_id, allNotServ }: IUserQuery,
) => {
  if (school_id) {
    const server = await prisma.schoolServer.findFirst({
      where: { AND: { server: { login }, school_id } },
      include: { server: true },
    });

    if (!server && allNotServ) {
      const user = await prisma.user.findFirst({
        where: { AND: { login, role: { in: ['ADMIN', 'SECRET'] } } },
      });

      if (!user) throw new AppError('user not found', 404);

      return UserReturnSchema.parse(user);
    }

    if (!server) throw new AppError('user not found', 404);

    return UserReturnSchema.parse(server.server);
  }

  if (allNotServ) {
    const user = await prisma.user.findFirst({
      where: { AND: { login, role: { in: ['ADMIN', 'SECRET'] } } },
    });

    if (!user) throw new AppError('user not found', 404);

    return UserReturnSchema.parse(user);
  }

  const user = await prisma.user.findUnique({
    where: { login },
  });

  if (!user) throw new AppError('user not found', 404);

  return UserReturnSchema.parse(user);
};
