import prisma from '../../prisma';

export const retrieveSchoolYearService = async (year: string) => {
  const schoolYear = await prisma.schoolYear.findUnique({ where: { year } });

  return schoolYear;
};
