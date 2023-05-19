import { IUserCpfQuery } from '../../interfaces';
import prisma from '../../prisma';

export const retrieveUserWithCpfService = async (
  login: string,
  { school_id, isSecret }: IUserCpfQuery,
) => {
  if (school_id) {
    const server = await prisma.schoolServer.findFirst({
      where: { AND: { server: { login }, school_id } },
    });

    return server;
  }

  if (isSecret) {
    const user = await prisma.user.findFirst({
      where: { AND: { login, role: { not: 'SERV' } } },
    });

    return user;
  }

  const user = await prisma.user.findUnique({
    where: { login },
  });

  return user;
};
