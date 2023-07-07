import { IFrequencyQuery } from '../../interfaces';
import prisma from '../../prisma';
import { infrequencyArrayReturn } from '../../scripts';

export const listInfrequencyService = async ({
  school_id,
  year_id,
  class_id,
  student_id,
  category,
}: IFrequencyQuery) => {
  const [infrequency, categoriesData] = await Promise.all([
    prisma.period.findMany({
      where: { category, year_id },
      select: { id: true, name: true, date_initial: true, date_final: true },
    }),
    prisma.period.findMany({
      where: { year_id },
      distinct: ['category'],
      select: { category: true },
    }),
  ]);

  const categories = categoriesData.map((el) => {
    return {
      id: el.category,
      label: el.category[0] + el.category.substring(1).toLowerCase(),
    };
  });

  const infreq = await infrequencyArrayReturn(
    infrequency,
    year_id,
    school_id,
    class_id,
    student_id,
  );

  const result = [];

  infreq.forEach((el) => {
    if (el) result.push(el);
  });

  return {
    result,
    categories,
  };
};
