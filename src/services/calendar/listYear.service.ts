import prisma from '../../prisma';

export const listYearService = async () => {
  const years = await prisma.schoolYear.findMany();

  return years;
};
