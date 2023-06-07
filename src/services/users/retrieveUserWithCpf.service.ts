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
      const user = await prisma.user.findUnique({ where: { login } });

      if (user.role === 'ADMIN' || user.role === 'SECRET') {
        return UserReturnSchema.parse(user);
      }

      return {};
    }

    return UserReturnSchema.parse(server.server);
  }

  if (allNotServ) {
    const user = await prisma.user.findUnique({ where: { login } });

    if (user.role === 'ADMIN' || user.role === 'SECRET') {
      return UserReturnSchema.parse(user);
    }

    return {};
  }

  const user = await prisma.user.findUnique({
    where: { login },
  });

  return UserReturnSchema.parse(user);
};
