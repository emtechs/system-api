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

  let where = {};
  const select = {
    id: true,
    name: true,
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
      break;
    }
  }

  if (name) where = { ...where, name: { contains: name, mode: 'insensitive' } };

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

  if (is_director) {
    switch (is_director) {
    case 'true':
      where = { ...where, director_id: { not: { equals: null } } };
      break;

    case 'false':
      where = { ...where, director_id: { equals: null } };
      break;
    }
  }

  const [schools, total, schoolsLabel] = await Promise.all([
    prisma.school.findMany({
      take,
      skip,
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
    schools: SchoolArraySchema.parse(schoolsLabel),
    total,
    result: SchoolArraySchema.parse(schools),
  };
};
