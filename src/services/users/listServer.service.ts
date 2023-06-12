import { ISchoolQuery } from '../../interfaces';
import prisma from '../../prisma';
import { ServerArraySchema } from '../../schemas';

export const listServerService = async (
  server_id: string,
  { name, take, skip, order, by }: ISchoolQuery,
) => {
  if (take) take = +take;
  if (skip) skip = +skip;

  let whereData = {};
  let orderBy = {};

  if (order) {
    switch (order) {
    case 'name':
      orderBy = { school: { name: by } };
      break;
    }
  }

  if (name)
    whereData = {
      ...whereData,
      school: {
        name: { contains: name, mode: 'insensitive' },
        is_active: true,
      },
    };

  whereData = { ...whereData, server_id };

  const servers = await prisma.schoolServer.findMany({
    take,
    skip,
    where: { ...whereData },
    include: { school: true },
    orderBy,
  });

  const total = await prisma.schoolServer.count({ where: { ...whereData } });

  const serversSchema = ServerArraySchema.parse(servers);

  return {
    total,
    result: serversSchema,
  };
};
