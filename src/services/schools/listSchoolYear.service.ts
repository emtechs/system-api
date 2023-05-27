import prisma from '../../prisma';

export const listSchoolYearService = async () => {
  const schoolYears = await prisma.schoolYear.findMany();

  return schoolYears;
};
