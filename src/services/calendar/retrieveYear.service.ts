import prisma from '../../prisma';

export const retrieveYearService = async (year: string) => {
  const schoolYear = await prisma.year.findUnique({ where: { year } });

  return schoolYear;
};
