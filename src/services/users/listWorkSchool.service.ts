import { IRequestUser, ISchoolQuery } from '../../interfaces';
import prisma from '../../prisma';
import { SchoolArraySchema, SchoolServerArraySchema } from '../../schemas';

export const listWorkSchoolService = async (
  { id: server_id, role }: IRequestUser,
  { take, skip }: ISchoolQuery,
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

  where_school = { ...where_school, is_active: true };

  if (role === 'ADMIN') {
    const select = select_school;

    where = where_school;

    const [schoolsData, total, schoolsLabel] = await Promise.all([
      prisma.school.findMany({
        take,
        skip,
        where,
        select,
        orderBy: { name: 'asc' },
      }),
      prisma.school.count({
        where,
      }),
      prisma.school.findMany({
        where,
        select,
        orderBy: { name: 'asc' },
      }),
    ]);

    const schoolSchema = SchoolArraySchema.parse(schoolsData);

    const result = schoolSchema.map((el) => {
      return { school: el };
    });

    return { schools: SchoolArraySchema.parse(schoolsLabel), total, result };
  }

  where = { ...where, server_id, school: where_school };

  const [workSchools, total, schoolsData] = await Promise.all([
    prisma.schoolServer.findMany({
      take,
      skip,
      where,
      select: {
        role: true,
        dash: true,
        school: { select: select_school },
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

  return { schools, total, result: SchoolServerArraySchema.parse(workSchools) };
};
