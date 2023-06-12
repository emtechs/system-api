import { ISchoolQuery } from '../../interfaces';
import prisma from '../../prisma';
import { ServerArraySchema } from '../../schemas';

export const listSchoolServerService = async (
  school_id: string,
  { name, take, skip, order, by }: ISchoolQuery,
) => {
  if (take) take = +take;
  if (skip) skip = +skip;

  let whereData = {};
  let orderBy = {};

  if (order) {
    switch (order) {
    case 'name':
      orderBy = { server: { name: by } };
      break;
    }
  }

  if (name)
    whereData = {
      ...whereData,
      server: { name: { contains: name, mode: 'insensitive' } },
    };

  whereData = { ...whereData, school_id };

  const servers = await prisma.schoolServer.findMany({
    take,
    skip,
    where: {
      ...whereData,
    },
    include: { server: true },
    orderBy,
  });

  const total = await prisma.schoolServer.count({ where: { ...whereData } });

  const serversSchema = ServerArraySchema.parse(servers);

  return {
    total,
    result: serversSchema,
  };
};
