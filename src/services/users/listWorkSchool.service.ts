import { IRequestUser, ISchoolQuery } from '../../interfaces';
import prisma from '../../prisma';
import { SchoolArraySchema, SchoolServerArraySchema } from '../../schemas';
import {
  schoolClassArrayReturn,
  schoolServerClassArrayReturn,
} from '../../scripts';

export const listWorkSchoolService = async (
  { id: server_id, role }: IRequestUser,
  { take, skip, year_id }: ISchoolQuery,
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

  if (year_id)
    where_school = { ...where_school, classes: { some: { year_id } } };

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

    const schools = SchoolArraySchema.parse(schoolsLabel);

    if (year_id) {
      const schoolsClass = await schoolClassArrayReturn(schoolSchema, year_id);

      const result = schoolsClass.map((el) => {
        return { school: el };
      });

      return {
        schools: await schoolClassArrayReturn(schools, year_id),
        total,
        result,
      };
    }

    const result = schoolSchema.map((el) => {
      return { school: el };
    });

    return { schools, total, result };
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

  if (year_id) {
    const schoolServerSchema = SchoolServerArraySchema.parse(workSchools);

    const schoolsClass = await schoolServerClassArrayReturn(
      schoolServerSchema,
      year_id,
    );

    const result = schoolsClass.map((el) => {
      return { school: el };
    });

    return {
      schools: await schoolClassArrayReturn(schools, year_id),
      total,
      result,
    };
  }

  return { schools, total, result: SchoolServerArraySchema.parse(workSchools) };
};
