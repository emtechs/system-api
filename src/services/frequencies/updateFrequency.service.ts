import { IFrequencyQuery, IFrequencyUpdateRequest } from '../../interfaces';
import prisma from '../../prisma';
import {
  FrequencyInfreqReturnSchema,
  FrequencyReturnSchema,
} from '../../schemas';
import { freqParseRetrieveFrequency } from '../../scripts';

export const updateFrequencyService = async (
  { status, finished_at, infreq }: IFrequencyUpdateRequest,
  id: string,
  { year_id }: IFrequencyQuery,
) => {
  const frequency = await prisma.frequency.update({
    where: { id },
    data: { status, finished_at, infreq },
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
          year: true,
          class: true,
        },
      },
      students: {
        include: { student: true },
        orderBy: { student: { name: 'asc' } },
      },
    },
  });

  if (year_id) {
    const frequencyReturn = await freqParseRetrieveFrequency(
      frequency,
      year_id,
    );

    return FrequencyInfreqReturnSchema.parse(frequencyReturn);
  }

  return FrequencyReturnSchema.parse(frequency);
};
