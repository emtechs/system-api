import prisma from '../../prisma';
import { ISchoolYearRequest } from '../../interfaces';

export const createYearService = async ({ year }: ISchoolYearRequest) => {
  const yearData = await prisma.year.create({
    data: {
      year,
    },
  });

  return yearData;
};
