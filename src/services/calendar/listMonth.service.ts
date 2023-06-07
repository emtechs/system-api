import prisma from '../../prisma';
import { MonthArraySchema } from '../../schemas';

export const listMonthService = async () => {
  const months = await prisma.month.findMany({ orderBy: { month: 'asc' } });
  return MonthArraySchema.parse(months);
};
