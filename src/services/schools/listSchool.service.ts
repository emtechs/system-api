import { ISchoolQuery } from '../../interfaces';
import prisma from '../../prisma';
import { SchoolArraySchema } from '../../schemas';
import { schoolClassArrayReturn, verifySchoolClassArr } from '../../scripts';

export const listSchoolService = async ({
  name,
  is_active,
  is_director,
  take,
  skip,
  order,
  by,
  server_id,
  year_id,
  infreq,
  none_server_id,
}: ISchoolQuery) => {
  if (take) take = +take;
  if (skip) skip = +skip;

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
      break;
    }
  }

  if (name) where = { ...where, name: { contains: name, mode: 'insensitive' } };

  if (infreq)
    where = {
      ...where,
      infrequencies: { some: { value: { gte: +infreq } } },
    };

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

  if (none_server_id)
    where = { ...where, servers: { none: { none_server_id } } };

  if (server_id) where = { ...where, servers: { some: { server_id } } };

  const [schools, total, schoolsLabel] = await Promise.all([
    prisma.school.findMany({
      take,
      skip,
      where,
      select: {
        ...select,
        classes: { distinct: ['year_id'], select: { year_id: true } },
      },
      orderBy,
    }),
    prisma.school.count({ where }),
    prisma.school.findMany({
      where,
      select: {
        ...select,
        classes: { distinct: ['year_id'], select: { year_id: true } },
      },
      orderBy: { name: 'asc' },
    }),
  ]);

  const schoolsSchema = SchoolArraySchema.parse(
    await verifySchoolClassArr(schools, year_id, server_id),
  );

  return {
    schools: SchoolArraySchema.parse(
      await verifySchoolClassArr(schoolsLabel, year_id, server_id),
    ),
    total,
    result: await schoolClassArrayReturn(schoolsSchema, year_id),
  };
};
