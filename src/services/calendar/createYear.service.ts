import prisma from '../../prisma';
import { ISchoolYearRequest } from '../../interfaces';

export const createYearService = async ({ year }: ISchoolYearRequest) => {
  const schoolYear = await prisma.schoolYear.create({
    data: {
      year,
    },
  });

  return schoolYear;
};
