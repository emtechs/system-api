import { IFrequencyQuery } from '../../interfaces';
import prisma from '../../prisma';
import { FrequencyReturnSchema } from '../../schemas';
import { freqParseFrequency, freqParseRetrieveFrequency } from '../../scripts';

export const retrieveFrequencyService = async (
  id: string,
  { school_year_id }: IFrequencyQuery,
) => {
  const frequency = await prisma.frequency.findUnique({
    where: { id },
    include: {
      _count: true,
      user: true,
      class: {
        include: {
          _count: { select: { frequencies: true, students: true } },
          students: { include: { student: true } },
          school: {
            include: {
              classes: {
                include: {
                  students: { include: { student: true } },
                },
              },
            },
          },
          school_year: true,
          class: true,
        },
      },
      students: {
        include: { student: true },
        orderBy: { student: { name: 'asc' } },
      },
    },
  });

  if (school_year_id) {
    const frequencyReturn = await freqParseRetrieveFrequency(
      frequency,
      school_year_id,
    );

    return FrequencyReturnSchema.parse(frequencyReturn);
  }

  const frequencyReturn = await freqParseFrequency(frequency);

  return FrequencyReturnSchema.parse(frequencyReturn);
};
