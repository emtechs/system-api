import { AppError } from '../../errors';
import prisma from '../../prisma';

export const verifyYear = async (id = '', year = '') => {
  let where = {};

  if (id.length > 0) where = { id };

  if (year.length > 0) where = { year };

  const yearData = await prisma.year.findFirst({
    where,
    select: {
      id: true,
      year: true,
    },
  });

  if (!yearData) throw new AppError('year not found', 404);

  const select = {
    id: yearData.id,
    label: yearData.year,
  };

  return { select };
};
