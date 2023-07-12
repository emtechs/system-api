import { AppError } from '../../errors';
import prisma from '../../prisma';

export const verifyFrequency = async (id: string) => {
  const frequency = await prisma.frequency.findUnique({
    where: { id },
    select: {
      date: true,
      class: {
        select: {
          school: { select: { name: true } },
          class: { select: { name: true } },
        },
      },
    },
  });

  if (!frequency) throw new AppError('frequency not found', 404);

  const select = {
    id,
    label: `${frequency.date} - ${frequency.class.school.name} - ${frequency.class.class.name}`,
  };

  return { select };
};
