import prisma from '../../prisma';
import { FrequencyReturnSchema } from '../../schemas';

export const retrieveFrequencyService = async (id: string) => {
  const frequency = await prisma.frequency.findUnique({
    where: { id },
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
