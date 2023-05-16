import { IFrequencyUpdateRequest } from '../../interfaces';
import prisma from '../../prisma';

export const updateFrequencyService = async (
  { status }: IFrequencyUpdateRequest,
  id: string,
) => {
  const frequency = await prisma.frequency.update({
    where: { id },
    data: { status },
    include: {
      school: true,
      class: true,
      students: {
        include: { student: true },
        orderBy: { student: { name: 'asc' } },
      },
    },
  });

  return frequency;
};
