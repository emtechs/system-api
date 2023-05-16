import { IFrequencyQuery } from '../../interfaces';
import prisma from '../../prisma';
import { FrequencyArraySchema } from '../../schemas';

export const listFrequencyService = async ({
  status,
  school_id,
  date,
  class_id,
}: IFrequencyQuery) => {
  let frequencies = await prisma.frequency.findMany({
    include: {
      school: true,
      class: true,
      students: {
        include: { student: true },
        orderBy: { student: { name: 'asc' } },
      },
    },
    orderBy: { date: 'asc' },
  });

  frequencies = status
    ? frequencies.filter((frequency) => status === frequency.status)
    : frequencies;

  frequencies = school_id
    ? frequencies.filter((frequency) => school_id === frequency.school_id)
    : frequencies;

  frequencies = date
    ? frequencies.filter((frequency) => date === frequency.date)
    : frequencies;

  frequencies = class_id
    ? frequencies.filter((frequency) => class_id === frequency.class_id)
    : frequencies;

  return FrequencyArraySchema.parse(frequencies);
};
