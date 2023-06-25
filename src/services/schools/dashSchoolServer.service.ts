import { ISchoolQuery } from '../../interfaces';
import prisma from '../../prisma';

export const dashSchoolServerService = async (
  school_id: string,
  { date, year_id }: ISchoolQuery,
) => {
  const [frequencyOpen, stundents] = await Promise.all([
    prisma.frequency.count({
      where: { school_id, status: 'OPENED' },
    }),
    prisma.classStudent.count({
      where: { school_id, year_id, is_active: true },
    }),
  ]);

  if (!date) return { frequencyOpen, stundents };

  const frequenciesData = await prisma.frequency.findMany({
    where: {
      status: 'CLOSED',
      date,
      school_id,
    },
  });

  let day_infreq = 0;

  frequenciesData.forEach((el) => {
    day_infreq += el.infrequency;
  });

  const frequencies = frequenciesData.length;

  if (year_id) {
    const [classTotal, { value: school_infreq }] = await Promise.all([
      prisma.classSchool.count({
        where: { school_id, year_id },
      }),
      prisma.schoolInfrequency.findUnique({
        where: { year_id_school_id: { school_id, year_id } },
        select: { value: true },
      }),
    ]);

    if (frequencies === 0)
      return {
        frequencies,
        school_infreq,
        frequencyOpen,
        classTotal,
        stundents,
      };

    day_infreq = day_infreq / frequencies;

    return {
      frequencies,
      day_infreq,
      school_infreq,
      frequencyOpen,
      classTotal,
      stundents,
    };
  }

  if (frequencies === 0)
    return {
      frequencies,
      frequencyOpen,
      stundents,
    };

  day_infreq = day_infreq / frequencies;

  return {
    frequencies,
    day_infreq,
    frequencyOpen,
    stundents,
  };
};
