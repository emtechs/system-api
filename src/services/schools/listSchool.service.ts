import { ISchoolQuery } from '../../interfaces';
import prisma from '../../prisma';
import { SchoolArraySchema } from '../../schemas';

export const listSchoolService = async ({
  name,
  is_active,
  is_director,
  take,
  skip,
  order,
  by,
}: ISchoolQuery) => {
  if (take) take = +take;
  if (skip) skip = +skip;

  let whereData = {};
  let orderBy = {};

  if (order) {
    switch (order) {
    case 'name':
      orderBy = { name: by };
      break;

    case 'director_name':
      orderBy = { director: { name: by } };
      break;
    }
  }

  if (name)
    whereData = { ...whereData, name: { contains: name, mode: 'insensitive' } };

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

  if (is_director) whereData = { ...whereData, director_id: { equals: null } };

  const [schools, total, schoolsLabel] = await Promise.all([
    prisma.school.findMany({
      take,
      skip,
      where: { ...whereData },
      orderBy,
      select: {
        id: true,
        name: true,
        director_id: true,
        director: { select: { id: true, cpf: true, name: true } },
      },
    }),
    prisma.school.count({ where: { ...whereData } }),
    prisma.school.findMany({
      where: { ...whereData },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        director: { select: { id: true, cpf: true, name: true } },
      },
    }),
  ]);

  return {
    schools: SchoolArraySchema.parse(schoolsLabel),
    total,
    result: SchoolArraySchema.parse(schools),
  };
};
