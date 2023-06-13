import { ICalendarQuery } from '../../interfaces';
import prisma from '../../prisma';

export const retrieveCalendarSchoolService = async (
  school_id: string,
  { date }: ICalendarQuery,
) => {
  if (!date) {
    return {};
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
    return {};
  }

  let infrequency = 0;

  frequenciesData.forEach((el) => (infrequency += el.infreq));
  const infreq = infrequency / frequencies;

  return { frequencies, infrequency: infreq };
};
