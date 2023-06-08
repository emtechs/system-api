import prisma from '../../prisma';

export const listYearService = async () => {
  const years = await prisma.year.findMany();

  return years;
};
