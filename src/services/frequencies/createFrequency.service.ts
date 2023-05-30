import prisma from '../../prisma';
import { IFrequencyRequest } from '../../interfaces';
import { FrequencyReturnSchema } from '../../schemas';

export const createFrequencyService = async (
  {
    date,
    month,
    class_id,
    school_id,
    school_year_id,
    students,
  }: IFrequencyRequest,
  user_id: string,
) => {
  const frequencyData = await prisma.frequency.findFirst({
    where: { date, month, class_id, school_id, school_year_id },
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

  if (frequencyData) {
    return FrequencyReturnSchema.parse(frequencyData);
  }

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

  return FrequencyReturnSchema.parse(frequency);
};
