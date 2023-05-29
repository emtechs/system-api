import { IFrequencyQuery } from '../../interfaces';
import prisma from '../../prisma';
import {
  FrequencyArraySchema,
  FrequencyInfreqArraySchema,
} from '../../schemas';
import { freqArrParseFrequency } from '../../scripts';

export const listFrequencyService = async ({
  take,
  status,
  date,
  class_id,
  is_infreq,
}: IFrequencyQuery) => {
  if (take) {
    take = +take;
  }

  let frequencies = await prisma.frequency.findMany({
    take,
    include: {
      _count: true,
      user: true,
      class: { include: { school: true, school_year: true, class: true } },
      students: {
        include: { student: true },
        orderBy: { student: { name: 'asc' } },
      },
    },
    orderBy: { finished_at: 'desc' },
  });

  frequencies = status
    ? frequencies.filter((frequency) => status === frequency.status)
    : frequencies;

  frequencies = date
    ? frequencies.filter((frequency) => date === frequency.date)
    : frequencies;

  frequencies = class_id
    ? frequencies.filter((frequency) => class_id === frequency.class_id)
    : frequencies;

  if (is_infreq) {
    const frequenciesReturn = await freqArrParseFrequency(frequencies);
    return FrequencyInfreqArraySchema.parse(frequenciesReturn);
  }

  return FrequencyArraySchema.parse(frequencies);
};
