import prisma from '../../prisma';
import { SchoolReturnSchema } from '../../schemas';

export const retrieveSchoolService = async (id: string) => {
  const select = {
    id: true,
    name: true,
    is_active: true,
    director: { select: { id: true, cpf: true, name: true } },
  };

  const [school, years] = await Promise.all([
    prisma.school.findUnique({
      where: { id },
      select,
    }),
    prisma.year.findMany({
      where: { classes: { some: { school_id: id } } },
      orderBy: { year: 'desc' },
    }),
  ]);

  return {
    school: SchoolReturnSchema.parse(school),
    years,
  };
};
