import { IFrequencyUpdateRequest } from '../../interfaces';
import prisma from '../../prisma';
import { parseFrequency } from '../../scripts';

export const updateFrequencyService = async (
  { status, finished_at }: IFrequencyUpdateRequest,
  id: string,
) => {
  const frequency = await prisma.frequency.update({
    where: { id },
    data: { status, finished_at },
    include: {
      class: true,
      students: {
        include: { student: true },
        orderBy: { student: { name: 'asc' } },
      },
    },
  });

  return frequency;
};
