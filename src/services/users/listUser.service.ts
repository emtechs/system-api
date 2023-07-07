import { IUserQuery } from '../../interfaces';
import prisma from '../../prisma';
import { UserArraySchema } from '../../schemas';
import { rolePtBr, userReturnArray } from '../../scripts';

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
    school_id,
  }: IUserQuery,
  id: string,
) => {
  if (take) take = +take;
  if (skip) skip = +skip;

  let where = {};
  let orderBy = {};

  if (order) {
    switch (order) {
    case 'name':
      orderBy = { name: by };
      break;
    }
  }

  if (name) where = { ...where, name: { contains: name, mode: 'insensitive' } };

  if (role) where = { ...where, role };

  if (school_id) where = { ...where, work_school: { some: { school_id } } };

  if (is_active) {
    switch (is_active) {
    case 'true':
      where = { ...where, is_active: true };
      break;

    case 'false':
      where = { ...where, is_active: false };
      break;
    }
  }

  if (isNot_director_school)
    where = { ...where, director_school: { none: {} } };

  where = { ...where, NOT: { id } };

  const [users, total, rolesData] = await Promise.all([
    prisma.user.findMany({
      take,
      skip,
      where,
      orderBy,
    }),
    prisma.user.count({
      where,
    }),
    prisma.user.findMany({
      where,
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
    result: await userReturnArray(usersSchema, school_id),
    roles,
  };
};
