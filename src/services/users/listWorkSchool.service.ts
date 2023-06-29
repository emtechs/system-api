import { IQuery, IRequestUser } from '../../interfaces';
import prisma from '../../prisma';
import { SchoolArraySchema, SchoolServerArraySchema } from '../../schemas';

export const listWorkSchoolService = async (
  { id: server_id, role }: IRequestUser,
  { take, skip }: IQuery,
) => {
  if (take) take = +take;
  if (skip) skip = +skip;

  const select_school = {
    id: true,
    name: true,
    director: { select: { id: true, cpf: true, name: true } },
  };

  if (role === 'ADMIN') {
    const where = { is_active: true };
    const select = select_school;

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

  const where = { server_id, school: { is_active: true } };

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
