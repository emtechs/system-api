import { AppError } from '../../errors';
import prisma from '../../prisma';
import { ClassReturnSchema } from '../../schemas';
import { classReturn } from '../../scripts';

export const retrieveClassService = async (id: string) => {
  const [classData, years, periodsData] = await Promise.all([
    prisma.class.findUnique({
      where: { id },
    }),
    prisma.year.findMany({
      where: { classes: { some: { class_id: id } } },
      orderBy: { year: 'desc' },
    }),
    prisma.period.findMany({
      distinct: ['category'],
      select: { category: true },
      orderBy: { category: 'asc' },
    }),
  ]);

  if (!classData) throw new AppError('school not found', 404);

  const periods = periodsData.map((el) => {
    return {
      id: el.category,
      label: el.category[0] + el.category.substring(1).toLowerCase(),
    };
  });

  return {
    class: ClassReturnSchema.parse(await classReturn(classData)),
    years,
    periods,
  };
};
