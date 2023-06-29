import { ISchoolQuery } from '../../interfaces';
import prisma from '../../prisma';
import { ServerArraySchema } from '../../schemas';

export const listSchoolServerService = async (
  school_id: string,
  { is_active, name, take, skip, order, by }: ISchoolQuery,
) => {
  if (take) take = +take;
  if (skip) skip = +skip;

  let whereData = {};
  let orderBy = {};
  let whereServer = {};

  if (order) {
    switch (order) {
    case 'name':
      orderBy = { server: { name: by } };
      break;
    }
  }

  if (is_active) {
    switch (is_active) {
    case 'true':
      whereServer = {
        ...whereServer,
        is_active: true,
      };
      whereData = {
        ...whereData,
        server: {
          ...whereServer,
        },
      };
      break;

    case 'false':
      whereServer = {
        ...whereServer,
        is_active: false,
      };
      whereData = {
        ...whereData,
        server: {
          ...whereServer,
        },
      };
      break;
    }
  }

  if (name)
    whereServer = {
      ...whereServer,
      name: { contains: name, mode: 'insensitive' },
    };

  whereData = {
    ...whereData,
    server: { ...whereServer },
  };

  whereData = { ...whereData, school_id };

  const [servers, total] = await Promise.all([
    prisma.schoolServer.findMany({
      take,
      skip,
      where: {
        ...whereData,
      },
      select: {
        role: true,
        dash: true,
        server: { select: { id: true, name: true, cpf: true } },
      },
      orderBy,
    }),
    prisma.schoolServer.count({ where: { ...whereData } }),
  ]);

  const serversSchema = ServerArraySchema.parse(servers);

  return {
    total,
    result: serversSchema,
  };
};
