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
        where: { AND: { login, role: { not: { in: ['ADMIN', 'SECRET'] } } } },
      });

      return user;
    }

    return UserReturnSchema.parse(server.server);
  }

  if (allNotServ) {
    const user = await prisma.user.findFirst({
      where: { AND: { login, role: { not: { in: ['ADMIN', 'SECRET'] } } } },
    });

    return user;
  }

  const user = await prisma.user.findUnique({
    where: { login },
  });

  return UserReturnSchema.parse(user);
};
