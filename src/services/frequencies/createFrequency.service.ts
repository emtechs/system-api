import prisma from '../../prisma';
import { IFrequencyRequest } from '../../interfaces';
import { FrequencyReturnSchema } from '../../schemas';
import { freqParseFrequency } from '../../scripts';

export const createFrequencyService = async (
  { date, class_id, school_id, school_year_id, students }: IFrequencyRequest,
  user_id: string,
) => {
  const frequency = await prisma.frequency.create({
    data: {
      date,
      user: { connect: { id: user_id } },
      class: {
        connectOrCreate: {
          where: {
            class_id_school_id_school_year_id: {
              class_id,
              school_id,
              school_year_id,
            },
          },
          create: { class_id, school_id, school_year_id },
        },
      },
      students: { createMany: { data: students } },
    },
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
