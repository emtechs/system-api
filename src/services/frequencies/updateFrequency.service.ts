import { IFrequencyUpdateRequest } from '../../interfaces';
import prisma from '../../prisma';
import { FrequencyReturnSchema } from '../../schemas';
import { freqParseFrequency } from '../../scripts';

export const updateFrequencyService = async (
  { status, finished_at }: IFrequencyUpdateRequest,
  id: string,
) => {
  const frequency = await prisma.frequency.update({
    where: { id },
    data: { status, finished_at },
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

  const frequencyReturn = await freqParseFrequency(frequency);

  return FrequencyReturnSchema.parse(frequencyReturn);
};
