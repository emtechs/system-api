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
  let where_school = {};
  let orderBy = {};

  if (order) {
    switch (order) {
    case 'name':
      orderBy = { school: { name: by } };
      break;

    case 'director_name':
      orderBy = { school: { director: { name: by } } };
    }
  }

  if (name)
    where_school = {
      ...where_school,
      name: { contains: name, mode: 'insensitive' },
    };

  if (infreq)
    where_school = {
      ...where_school,
      infrequencies: { some: { value: { gte: +infreq } } },
    };

  where_school = { ...where_school, is_active: true };

  where = {
    ...where,
    year_id,
    school: { ...where_school },
  };

  const [schoolsData, schoolsLabel] = await Promise.all([
    prisma.classSchool.findMany({
      skip,
      take,
      where,
      distinct: ['school_id'],
      select: {
        school: {
          select: {
            id: true,
            name: true,
            is_active: true,
            director: { select: { name: true, id: true, cpf: true } },
            infrequencies: {
              where: { period: { year_id, category: 'ANO' } },
              select: { value: true },
            },
            _count: {
              select: { classes: { where: { year_id } }, servers: true },
            },
          },
        },
        _count: {
          select: {
            frequencies: { where: { status: 'CLOSED', year_id } },
            students: { where: { is_active: true, year_id } },
          },
        },
      },
      orderBy,
    }),
    prisma.classSchool.findMany({
      where,
      distinct: ['school_id'],
      select: {
        school: {
          select: {
            id: true,
            name: true,
            is_active: true,
            director: { select: { name: true, id: true, cpf: true } },
            infrequencies: {
              where: { period: { year_id, category: 'ANO' } },
              select: { value: true },
            },
            _count: {
              select: { classes: { where: { year_id } }, servers: true },
            },
          },
        },
        _count: {
          select: {
            frequencies: { where: { status: 'CLOSED', year_id } },
            students: { where: { is_active: true, year_id } },
          },
        },
      },
      orderBy: { school: { name: 'asc' } },
    }),
  ]);

  return {
    schools: await schoolClassArrayReturn(schoolsLabel, year_id),
    total: schoolsLabel.length,
    result: await schoolClassArrayReturn(schoolsData, year_id),
  };
};
