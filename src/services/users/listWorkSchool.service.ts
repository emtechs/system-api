import { IRequestUser, ISchoolQuery } from '../../interfaces';
import prisma from '../../prisma';
import { SchoolArraySchema, SchoolServerArraySchema } from '../../schemas';
import {
  classesArrSchoolClassReturn,
  serverArrSchoolClassReturn,
} from '../../scripts';

export const listWorkSchoolService = async (
  year_id: string,
  { id: server_id, role }: IRequestUser,
  { take, skip, name }: ISchoolQuery,
) => {
  if (take) take = +take;
  if (skip) skip = +skip;

  let where = {};
  let where_school = {};

  const select_school = {
    id: true,
    name: true,
    is_active: true,
    director: { select: { id: true, cpf: true, name: true } },
  };

  if (name)
    where_school = {
      ...where_school,
      name: { contains: name, mode: 'insensitive' },
    };

  if (role === 'ADMIN') {
    where_school = {
      ...where_school,
      is_active: true,
      classes: { some: { year_id } },
    };

    const [schoolsData, total, schoolsLabel] = await Promise.all([
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
      prisma.school.findMany({
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
    ]);

    const schoolSchema = classesArrSchoolClassReturn(schoolsData);

    const result = schoolSchema.map((el) => {
      return { school: el };
    });

    return {
      schools: classesArrSchoolClassReturn(schoolsLabel),
      total,
      result,
    };
  }

  where = {
    ...where,
    server_id,
    school: {
      ...where_school,
    },
  };

  const [workSchools, total, schoolsData] = await Promise.all([
    prisma.schoolServer.findMany({
      take,
      skip,
      where,
      select: {
        role: true,
        dash: true,
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
    prisma.schoolServer.findMany({
      where,
      select: { school: { select: select_school } },
      orderBy: { school: { name: 'asc' } },
    }),
  ]);

  const schoolSchema = SchoolServerArraySchema.parse(schoolsData);

  const schools = schoolSchema.map((el) => el.school);

  return { schools, total, result: serverArrSchoolClassReturn(workSchools) };
};
