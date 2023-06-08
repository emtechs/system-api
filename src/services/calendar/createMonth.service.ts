import prisma from '../../prisma';
import { IMonthRequest } from '../../interfaces';
import { MonthCreateSchema } from '../../schemas';

export const createMonthService = async ({
  month,
  name,
  date,
}: IMonthRequest) => {
  month = +month;
  let monthData = await prisma.month.findUnique({
    where: { month },
  });

  if (monthData) {
    return MonthCreateSchema.parse(monthData);
  }

  monthData = await prisma.month.create({
    data: {
      month,
      name,
      date,
    },
  });

  return MonthCreateSchema.parse(monthData);
};
