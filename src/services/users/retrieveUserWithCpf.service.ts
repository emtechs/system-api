import { AppError } from '../../errors';
import { IUserQuery } from '../../interfaces';
import prisma from '../../prisma';
import { UserReturnSchema } from '../../schemas';

export const retrieveUserWithCpfService = async (
  login: string,
  { school_id, allNotServ, director }: IUserQuery,
) => {
  if (school_id) {
    if (director) {
      const [server, user] = await Promise.all([
        prisma.schoolServer.findFirst({
          where: {
            server: { login },
            school_id,
            role: 'DIRET',
          },
        }),
        prisma.user.findUnique({
          where: { login },
          select: { name: true, role: true },
        }),
      ]);

      if (!user) return { name: '' };

      if (server || user.role === 'ADMIN')
        throw new AppError('user already exists', 409);

      return user;
    }

    const [server, user] = await Promise.all([
      prisma.schoolServer.findFirst({
        where: {
          server: { login },
          school_id,
        },
      }),
      prisma.user.findUnique({
        where: { login },
        select: { name: true, role: true },
      }),
    ]);

    if (!user) return { name: '' };

    if (server || user.role === 'ADMIN')
      throw new AppError('user already exists', 409);

    return user;
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
