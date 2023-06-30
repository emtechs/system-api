import { ISchoolQuery } from '../../interfaces';
import prisma from '../../prisma';
import { ServerArraySchema } from '../../schemas';

export const listSchoolServerService = async (
  school_id: string,
  { name, take, skip, order, by }: ISchoolQuery,
) => {
  if (take) take = +take;
  if (skip) skip = +skip;

  let where = {};
  let orderBy = {};
  let where_server = {};

  if (order) {
    switch (order) {
    case 'name':
      orderBy = { server: { name: by } };
      break;
    }
  }

  if (name)
    where_server = {
      ...where_server,
      name: { contains: name, mode: 'insensitive' },
    };

  where = {
    ...where,
    server: { ...where_server },
    school_id,
  };

  const [servers, total] = await Promise.all([
    prisma.schoolServer.findMany({
      take,
      skip,
      where,
      select: {
        role: true,
        dash: true,
        server: { select: { id: true, name: true, cpf: true } },
      },
      orderBy,
    }),
    prisma.schoolServer.count({ where }),
  ]);

  const serversSchema = ServerArraySchema.parse(servers);

  return {
    total,
    result: serversSchema,
  };
};
