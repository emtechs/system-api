import { ISchoolQuery } from '../../interfaces';
import prisma from '../../prisma';
import { schoolClassArrayReturn } from '../../scripts';

export const listSchoolClassService = async (
  year_id: string,
  { skip, take, name, infreq, order, by }: ISchoolQuery,
) => {
  if (skip) skip = +skip;
  if (take) take = +take;

  let where = {};
  const select = {
    id: true,
    name: true,
    is_active: true,
    director: { select: { id: true, cpf: true, name: true } },
  };
  let orderBy = {};

  if (order) {
    switch (order) {
    case 'name':
      orderBy = { name: by };
      break;

    case 'director_name':
      orderBy = { director: { name: by } };
    }
  }

  if (name)
    where = {
      ...where,
      name: { contains: name, mode: 'insensitive' },
    };

  if (infreq)
    where = {
      ...where,
      infrequencies: { some: { value: { gte: +infreq } } },
    };

  where = { ...where, is_active: true };

  const [schoolsData, total, schoolsLabel] = await Promise.all([
    prisma.school.findMany({
      skip,
      take,
      where,
      select,
      orderBy,
    }),
    prisma.school.count({ where }),
    prisma.school.findMany({
      where,
      select,
      orderBy: { name: 'asc' },
    }),
  ]);

  return {
    schools: await schoolClassArrayReturn(schoolsLabel, year_id),
    total,
    result: await schoolClassArrayReturn(schoolsData, year_id),
  };
};
