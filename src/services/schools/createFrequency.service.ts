import prisma from '../../prisma';
import { IFrequencyRequest } from '../../interfaces';
import { FrequencyReturnSchema } from '../../schemas';

export const createFrequencyService = async (
  { date, class_id, students }: IFrequencyRequest,
  user_id: string,
) => {
  const frequency = await prisma.frequency.create({
    data: {
      date,
      class_id,
      user_id,
      students: { createMany: { data: students } },
    },
    include: {
      user: true,
      class: true,
      students: { include: { student: true } },
    },
  });

  return FrequencyReturnSchema.parse(frequency);
};
