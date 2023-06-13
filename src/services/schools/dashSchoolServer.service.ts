import { ISchoolQuery } from '../../interfaces';
import prisma from '../../prisma';

export const dashSchoolServerService = async (
  school_id: string,
  { date, year_id }: ISchoolQuery,
) => {
  const { infreq: school_infreq } = await prisma.school.findUnique({
    where: { id: school_id },
    select: { infreq: true },
  });

  const frequencyOpen = await prisma.frequency.count({
    where: { school_id, status: 'OPENED' },
  });

  if (!date) {
    return { school_infreq, frequencyOpen };
  }

  const frequenciesData = await prisma.frequency.findMany({
    where: {
      status: 'CLOSED',
      date,
      school_id,
    },
  });

  const frequencies = frequenciesData.length;

  if (year_id) {
    const classTotal = await prisma.classSchool.count({
      where: { school_id, year_id },
    });

    return {
      frequencies,
      school_infreq,
      frequencyOpen,
      classTotal,
    };
  }

  return { frequencies, school_infreq, frequencyOpen };
};
