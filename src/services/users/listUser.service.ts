import { IUserQuery } from '../../interfaces';
import prisma from '../../prisma';
import { UserArraySchema } from '../../schemas';
import { rolePtBr } from '../../scripts';

export const listUserService = async (
  {
    role,
    is_active,
    isNot_director_school,
    take,
    skip,
    order,
    by,
    name,
  }: IUserQuery,
  id: string,
) => {
  if (take) take = +take;
  if (skip) skip = +skip;

  let whereData = {};
  let orderBy = {};

  if (order) {
    switch (order) {
    case 'name':
      orderBy = { name: by };
      break;
    }
  }

  if (name)
    whereData = { ...whereData, name: { contains: name, mode: 'insensitive' } };

  if (role) {
    if (role === 'SERV') {
      whereData = {
        ...whereData,
        role: { not: { in: ['ADMIN', 'SECRET'] } },
      };
    } else {
      whereData = {
        ...whereData,
        role: role,
      };
    }
  }

  if (is_active) {
    switch (is_active) {
    case 'true':
      whereData = { ...whereData, is_active: true };
      break;

    case 'false':
      whereData = { ...whereData, is_active: false };
      break;
    }
  }

  if (isNot_director_school)
    whereData = { ...whereData, director_school: { none: {} } };

  whereData = { ...whereData, NOT: { id } };

  const [users, total, rolesData] = await Promise.all([
    prisma.user.findMany({
      take,
      skip,
      where: { ...whereData },
      orderBy,
      include: {
        director_school: true,
        work_school: {
          include: {
            school: true,
          },
        },
      },
    }),
    prisma.user.count({
      where: { ...whereData },
    }),
    prisma.user.findMany({
      where: { ...whereData },
      distinct: ['role'],
      orderBy: { role: 'asc' },
      select: { role: true },
    }),
  ]);

  const usersSchema = UserArraySchema.parse(users);

  const roles = rolesData.map((el) => {
    return { id: el.role, label: rolePtBr(el.role) };
  });

  return {
    total,
    result: usersSchema,
    roles,
  };
};
