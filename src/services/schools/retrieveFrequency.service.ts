import prisma from '../../prisma';
import { FrequencyReturnSchema } from '../../schemas';

export const retrieveFrequencyService = async (id: string) => {
  const frequencie = await prisma.frequency.findUnique({
    where: { id },
    include: {
      school: true,
      class: true,
      students: {
        include: { student: true },
        orderBy: { student: { name: 'asc' } },
      },
    },
  });

  return FrequencyReturnSchema.parse(frequencie);
};
