import { ICalendarQuery } from '../../interfaces';
import prisma from '../../prisma';

export const retrieveCalendarSchoolService = async (
  school_id: string,
  { date }: ICalendarQuery,
) => {
  const { infreq: school_infreq } = await prisma.school.findUnique({
    where: { id: school_id },
    select: { infreq: true },
  });

  if (!date) {
    return { school_infreq };
  }

  const frequenciesData = await prisma.frequency.findMany({
    where: {
      status: 'CLOSED',
      date,
      school_id,
    },
  });

  const frequencies = frequenciesData.length;

  if (frequencies === 0) {
    return { school_infreq };
  }

  let infrequency = 0;

  frequenciesData.forEach((el) => (infrequency += el.infreq));
  const infreq = infrequency / frequencies;

  return { frequencies, infrequency: infreq, school_infreq };
};
