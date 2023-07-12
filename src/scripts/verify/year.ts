import { AppError } from '../../errors';
import prisma from '../../prisma';

export const verifyYear = async (id: string) => {
  const year = await prisma.year.findUnique({
    where: { id },
    select: {
      year: true,
    },
  });

  if (!year) throw new AppError('year not found', 404);

  const select = {
    id,
    label: year.year,
  };

  return { select };
};
