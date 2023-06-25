import { IQuery } from '../../interfaces';
import prisma from '../../prisma';

export const listWorkSchoolService = async (
  server_id: string,
  { take, skip }: IQuery,
) => {
  if (take) take = +take;
  if (skip) skip = +skip;

  const where = { server_id, school: { is_active: true } };
  const school = { select: { id: true, name: true } };

  const [workSchools, total, schoolsData] = await Promise.all([
    prisma.schoolServer.findMany({
      take,
      skip,
      where,
      select: {
        role: true,
        dash: true,
        school,
      },
      orderBy: { school: { name: 'asc' } },
    }),
    prisma.schoolServer.count({
      where,
    }),
    prisma.schoolServer.findMany({
      where,
      select: { school },
      orderBy: { school: { name: 'asc' } },
    }),
  ]);

  const schools = schoolsData.map((el) => {
    return {
      id: el.school.id,
      label: el.school.name,
      ...el.school,
    };
  });

  return { schools, total, result: workSchools };
};
