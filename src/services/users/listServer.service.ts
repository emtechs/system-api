import { ISchoolQuery } from '../../interfaces';
import prisma from '../../prisma';
import { ServerArraySchema } from '../../schemas';

export const listServerService = async (
  server_id: string,
  { is_active, name, take, skip, order, by }: ISchoolQuery,
) => {
  if (take) take = +take;
  if (skip) skip = +skip;

  let whereData = {};
  let orderBy = {};
  let whereSchool = {};

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
      whereSchool = {
        ...whereSchool,
        is_active: true,
      };
      whereData = {
        ...whereData,
        school: {
          ...whereSchool,
        },
      };
      break;

    case 'false':
      whereSchool = {
        ...whereSchool,
        is_active: false,
      };
      whereData = {
        ...whereData,
        school: {
          ...whereSchool,
        },
      };
      break;
    }
  }

  if (name) {
    whereSchool = {
      ...whereSchool,
      name: { contains: name, mode: 'insensitive' },
    };
    whereData = {
      ...whereData,
      school: {
        ...whereSchool,
      },
    };
  }

  whereData = {
    ...whereData,
    server_id,
  };

  const [servers, total] = await Promise.all([
    prisma.schoolServer.findMany({
      take,
      skip,
      where: {
        ...whereData,
      },
      include: { school: true },
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
