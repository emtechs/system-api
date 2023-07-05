import { ISchoolQuery } from '../../interfaces';
import prisma from '../../prisma';
import { SchoolReturnSchema } from '../../schemas';
import { verifySchoolClass } from '../../scripts';

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

  const [school, years] = await Promise.all([
    prisma.school.findUnique({
      where: { id },
      select: {
        ...select,
        classes: { distinct: ['year_id'], select: { year_id: true } },
      },
    }),
    prisma.year.findMany({
      where: { classes: { some: { school_id: id } } },
      orderBy: { year: 'desc' },
    }),
  ]);

  return {
    school: SchoolReturnSchema.parse(verifySchoolClass(school, year_id)),
    years,
  };
};
