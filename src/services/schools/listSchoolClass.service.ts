import { ISchoolQuery } from '../../interfaces';
import prisma from '../../prisma';

export const listSchoolClassService = async (
  year_id: string,
  { skip, take, name, infreq, order, by }: ISchoolQuery,
) => {
  if (skip) skip = +skip;
  if (take) take = +take;

  let whereData = {};
  let whereSchool = {};
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
    whereSchool = {
      ...whereSchool,
      name: { contains: name, mode: 'insensitive' },
    };

  if (infreq)
    whereSchool = {
      ...whereSchool,
      infrequencies: { some: { value: { gte: +infreq } } },
    };

  whereSchool = { ...whereSchool, is_active: true };

  whereData = {
    ...whereData,
    year_id,
    school: { ...whereSchool },
  };

  const [schools, total] = await Promise.all([
    prisma.classSchool.findMany({
      skip,
      take,
      where: {
        ...whereData,
      },
      distinct: ['school_id'],
      select: {
        school: {
          select: {
            id: true,
            name: true,
            director: { select: { name: true } },
            infrequencies: {
              where: { period: { year_id, category: 'ANO' } },
              select: { value: true },
            },
            _count: { select: { classes: { where: { year_id } } } },
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
    prisma.school.count({
      where: { ...whereSchool },
    }),
  ]);

  const result = schools.map((el) => {
    let director = '';
    let infrequency = 0;

    if (el.school.director) director = el.school.director.name;

    if (el.school.infrequencies.length > 0)
      infrequency = el.school.infrequencies[0].value;

    return {
      id: el.school.id,
      name: el.school.name,
      director,
      classes: el.school._count.classes,
      students: el._count.students,
      frequencies: el._count.frequencies,
      infrequency,
    };
  });

  return { total, result };
};
