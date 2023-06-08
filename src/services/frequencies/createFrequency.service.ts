import prisma from '../../prisma';
import { IFrequencyRequest } from '../../interfaces';
import { FrequencyReturnSchema } from '../../schemas';

export const createFrequencyService = async (
  {
    date,
    month,
    day,
    class_id,
    school_id,
    year_id,
    students,
  }: IFrequencyRequest,
  user_id: string,
) => {
  const frequencyData = await prisma.frequency.findFirst({
    where: { date, class_id, school_id, year_id },
  });

  if (frequencyData) {
    return FrequencyReturnSchema.parse(frequencyData);
  }

  month = +month;
  day = +day;

  const frequency = await prisma.frequency.create({
    data: {
      date,
      month: { connect: { month } },
      day: { connectOrCreate: { where: { day }, create: { day } } },
      user: { connect: { id: user_id } },
      class: {
        connectOrCreate: {
          where: {
            class_id_school_id_year_id: {
              class_id,
              school_id,
              year_id,
            },
          },
          create: { class_id, school_id, year_id },
        },
      },
      students: { createMany: { data: students } },
    },
  });

  return FrequencyReturnSchema.parse(frequency);
};
