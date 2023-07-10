import { AppError } from '../../errors';
import prisma from '../../prisma';
import { ClassReturnSchema } from '../../schemas';

export const retrieveClassService = async (id: string) => {
  const select = { id: true, name: true, is_active: true };

  const [classData, years, periodsData] = await Promise.all([
    prisma.class.findUnique({
      where: { id },
      select,
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

  const [schools, students, frequencies] = await Promise.all([
    prisma.school.count({ where: { classes: { every: { class_id: id } } } }),
    prisma.student.count({ where: { classes: { some: { class_id: id } } } }),
    prisma.frequency.count({ where: { class_id: id, status: 'CLOSED' } }),
  ]);

  const classReturn = { ...classData, schools, students, frequencies };

  const periods = periodsData.map((el) => {
    return {
      id: el.category,
      label: el.category[0] + el.category.substring(1).toLowerCase(),
    };
  });

  return {
    class: ClassReturnSchema.parse(classReturn),
    years,
    periods,
  };
};
