import { IFrequencyUpdateRequest } from '../../interfaces';
import prisma from '../../prisma';
import { FrequencyInfreqReturnSchema } from '../../schemas';
import { freqParseRetrieveFrequency } from '../../scripts';

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

  const frequencyReturn = await freqParseRetrieveFrequency(
    frequency,
    frequency.year_id,
  );

  return FrequencyInfreqReturnSchema.parse(frequencyReturn);
};
