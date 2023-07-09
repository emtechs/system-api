import { IRequestUser, ISchoolQuery } from '../../interfaces';
import prisma from '../../prisma';
import { SchoolArraySchema, SchoolServerArraySchema } from '../../schemas';
import {
  schoolClassArrayReturn,
  schoolServerClassArrayReturn,
  verifySchoolClassArr,
  verifySchoolServerClassArr,
} from '../../scripts';

export const listWorkSchoolService = async (
  { id: server_id, role }: IRequestUser,
  { take, skip, year_id, name }: ISchoolQuery,
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

  if (name)
    where_school = {
      ...where_school,
      name: { contains: name, mode: 'insensitive' },
    };

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
        select: {
          ...select,
          classes: { distinct: ['year_id'], select: { year_id: true } },
        },
        orderBy: { name: 'asc' },
      }),
      prisma.school.count({
        where,
      }),
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
      await verifySchoolClassArr(schoolsData, year_id),
    );

    const schools = SchoolArraySchema.parse(schoolsLabel);

    const schoolsClass = await schoolClassArrayReturn(schoolsSchema, year_id);

    const result = schoolsClass.map((el) => {
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
        school: {
          select: {
            ...select_school,
            classes: { distinct: ['year_id'], select: { year_id: true } },
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
      select: {
        school: {
          select: {
            ...select_school,
            classes: { distinct: ['year_id'], select: { year_id: true } },
          },
        },
      },
      orderBy: { school: { name: 'asc' } },
    }),
  ]);

  const schoolSchema = SchoolServerArraySchema.parse(schoolsData);

  const schools = schoolSchema.map((el) => el.school);

  const schoolServerSchema = SchoolServerArraySchema.parse(
    verifySchoolServerClassArr(workSchools, year_id),
  );

  const result = await schoolServerClassArrayReturn(
    schoolServerSchema,
    year_id,
  );

  return { schools, total, result };
};
