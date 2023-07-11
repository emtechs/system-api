import { AppError } from '../../errors';
import { ISchoolQuery } from '../../interfaces';
import prisma from '../../prisma';
import { SchoolReturnSchema } from '../../schemas';
import { schoolReturn } from '../../scripts';

export const retrieveSchoolService = async (
  id: string,
  { year_id }: ISchoolQuery,
) => {
  const select = {
    id: true,
    name: true,
    is_active: true,
    director: { select: { id: true, cpf: true, name: true } },
  };

  const [school, years, periodsData] = await Promise.all([
    prisma.school.findUnique({
      where: { id },
      select,
    }),
    prisma.year.findMany({
      where: { classes: { some: { school_id: id } } },
      orderBy: { year: 'desc' },
    }),
    prisma.period.findMany({
      distinct: ['category'],
      select: { category: true },
      orderBy: { category: 'asc' },
    }),
  ]);

  if (!school) throw new AppError('school not found', 404);

  const periods = periodsData.map((el) => {
    return {
      id: el.category,
      label: el.category[0] + el.category.substring(1).toLowerCase(),
    };
  });

  return {
    school: SchoolReturnSchema.parse(await schoolReturn(school, year_id)),
    years,
    periods,
  };
};
