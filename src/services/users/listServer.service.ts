import { ISchoolQuery } from '../../interfaces';
import prisma from '../../prisma';
import { SchoolServerArraySchema } from '../../schemas';

export const listServerService = async (
  server_id: string,
  { is_active, name, take, skip, order, by }: ISchoolQuery,
) => {
  if (take) take = +take;
  if (skip) skip = +skip;

  let where = {};
  let where_school = {};
  let orderBy = {};

  if (order) {
    switch (order) {
    case 'name':
      orderBy = { school: { name: by } };
      break;
    }
  }

  if (is_active) {
    switch (is_active) {
    case 'true':
      where_school = {
        ...where_school,
        is_active: true,
      };
      break;

    case 'false':
      where_school = {
        ...where_school,
        is_active: false,
      };
      break;
    }
  }

  if (name)
    where_school = {
      ...where_school,
      name: { contains: name, mode: 'insensitive' },
    };

  where = {
    ...where,
    school: {
      ...where_school,
    },
    server_id,
  };

  const [servers, total, user] = await Promise.all([
    prisma.schoolServer.findMany({
      take,
      skip,
      where,
      select: {
        dash: true,
        role: true,
        school: { select: { name: true, id: true, is_active: true } },
      },
      orderBy,
    }),
    prisma.schoolServer.count({ where }),
    prisma.user.findUnique({
      where: { id: server_id },
      select: { id: true, name: true },
    }),
  ]);

  const serversSchema = SchoolServerArraySchema.parse(servers);

  return {
    total,
    result: serversSchema,
    user,
  };
};
