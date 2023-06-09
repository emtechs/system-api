import { IUserQuery } from '../../interfaces';
import prisma from '../../prisma';
import { UserArraySchema } from '../../schemas';

export const listUserService = async (
  { role, is_active, isNot_director_school, take }: IUserQuery,
  id: string,
) => {
  if (take) {
    take = +take;
  }

  if (role === 'SERV') {
    const users = await prisma.user.findMany({
      where: { role: { not: { in: ['ADMIN', 'SECRET'] } } },
    });

    return UserArraySchema.parse(users);
  }

  let users = await prisma.user.findMany({
    take,
    where: { NOT: { id } },
    orderBy: { name: 'asc' },
    include: {
      director_school: true,
      work_school: {
        include: {
          school: true,
        },
      },
    },
  });

  if (is_active) {
    switch (is_active) {
      case 'true':
        users = users.filter((user) => user.is_active === true);
        break;
      case 'false':
        users = users.filter((user) => user.is_active === false);
        break;
    }
  }

  users = role ? users.filter((user) => role === user.role) : users;

  users = isNot_director_school
    ? users.filter((user) => !user.director_school)
    : users;

  return UserArraySchema.parse(users);
};
