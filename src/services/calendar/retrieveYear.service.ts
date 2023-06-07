import prisma from '../../prisma';

export const retrieveYearService = async (year: string) => {
  const schoolYear = await prisma.schoolYear.findUnique({ where: { year } });

  return schoolYear;
};
