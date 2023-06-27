import prisma from '../../prisma';

export const listPeriodService = async () => {
  const periods = await prisma.period.findMany();

  return periods;
};
