import prisma from '../../prisma';
import { IFrequencyRequest } from '../../interfaces';
import { FrequencyReturnSchema } from '../../schemas';

export const createFrequencyService = async (
  { date, class_id, school_id, students }: IFrequencyRequest,
  user_id: string,
) => {
  const frequency = await prisma.frequency.create({
    data: {
      date,
      user: { connect: { id: user_id } },
      class: {
        connectOrCreate: {
          where: { class_id_school_id: { class_id, school_id } },
          create: { class_id, school_id },
        },
      },
      students: { createMany: { data: students } },
    },
    include: {
      user: true,
      class: { include: { class: true } },
      students: { include: { student: true } },
    },
  });

  return FrequencyReturnSchema.parse(frequency);
};
