import { IRequestUser, ISchoolQuery } from '../../interfaces';
import prisma from '../../prisma';
import {
  classesArrSchoolClassReturn,
  serverArrSchoolClassReturn,
} from '../../scripts';

export const listWorkSchoolClassService = async (
  year_id: string,
  { id: server_id, role }: IRequestUser,
  { take, skip, name }: ISchoolQuery,
) => {
  if (take) take = +take;
  if (skip) skip = +skip;

  let where = {};
  let where_school = {};

  if (name)
    where_school = {
      ...where_school,
      name: { contains: name, mode: 'insensitive' },
    };

  where_school = {
    ...where_school,
    is_active: true,
    classes: { some: { year_id } },
  };

  if (role === 'ADMIN') {
    where = where_school;

    const [schoolsData, total] = await Promise.all([
      prisma.school.findMany({
        take,
        skip,
        where,
        select: {
          classes: {
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
          },
        },
        orderBy: { name: 'asc' },
      }),
      prisma.school.count({
        where,
      }),
    ]);

    return {
      total,
      result: classesArrSchoolClassReturn(schoolsData),
    };
  }

  where = {
    ...where,
    server_id,
    school: {
      ...where_school,
    },
  };

  const [schoolsData, total] = await Promise.all([
    prisma.schoolServer.findMany({
      take,
      skip,
      where,
      select: {
        school: {
          select: {
            classes: {
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
                      select: {
                        classes: { where: { year_id } },
                        servers: true,
                      },
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
            },
          },
        },
      },
      orderBy: { school: { name: 'asc' } },
    }),
    prisma.schoolServer.count({
      where,
    }),
  ]);

  return {
    total,
    result: serverArrSchoolClassReturn(schoolsData),
  };
};
