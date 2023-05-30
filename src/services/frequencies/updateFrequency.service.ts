import { IFrequencyUpdateRequest } from '../../interfaces';
import prisma from '../../prisma';
import { FrequencyReturnSchema } from '../../schemas';

export const updateFrequencyService = async (
  { status, month, finished_at }: IFrequencyUpdateRequest,
  id: string,
) => {
  const frequency = await prisma.frequency.update({
    where: { id },
    data: { status, month, finished_at },
    include: {
      _count: true,
      user: true,
      class: { include: { school: true, school_year: true, class: true } },
      students: {
        include: { student: true },
        orderBy: { student: { name: 'asc' } },
      },
    },
  });

  return FrequencyReturnSchema.parse(frequency);
};
