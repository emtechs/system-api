import { IQuery } from '../../interfaces';
import prisma from '../../prisma';

export const listWorkSchoolService = async (
  server_id: string,
  { take, skip }: IQuery,
) => {
  if (take) take = +take;
  if (skip) skip = +skip;

  const [workSchools, total, schoolsData] = await Promise.all([
    prisma.schoolServer.findMany({
      take,
      skip,
      where: { server_id },
      select: { role: true, dash: true, school: true },
      orderBy: { school: { name: 'asc' } },
    }),
    prisma.schoolServer.count({
      where: { server_id },
    }),
    prisma.schoolServer.findMany({
      where: { server_id },
      select: { school: true },
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
