import { ISchoolQuery } from '../../interfaces';
import prisma from '../../prisma';

export const dashSchoolServerService = async (
  school_id: string,
  { date, year_id }: ISchoolQuery,
) => {
  const [{ infreq: school_infreq }, frequencyOpen, stundents] =
    await Promise.all([
      prisma.school.findUnique({
        where: { id: school_id },
        select: { infreq: true },
      }),
      prisma.frequency.count({
        where: { school_id, status: 'OPENED' },
      }),
      prisma.classStudent.count({
        where: { school_id, year_id, is_active: true },
      }),
    ]);

  if (!date) return { school_infreq, frequencyOpen, stundents };

  const frequenciesData = await prisma.frequency.findMany({
    where: {
      status: 'CLOSED',
      date,
      school_id,
    },
  });

  let day_infreq = 0;

  frequenciesData.forEach((el) => {
    day_infreq += el.infreq;
  });

  const frequencies = frequenciesData.length;

  if (year_id) {
    const classTotal = await prisma.classSchool.count({
      where: { school_id, year_id },
    });

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
      school_infreq,
      frequencyOpen,
      stundents,
    };

  day_infreq = day_infreq / frequencies;

  return {
    frequencies,
    day_infreq,
    school_infreq,
    frequencyOpen,
    stundents,
  };
};
