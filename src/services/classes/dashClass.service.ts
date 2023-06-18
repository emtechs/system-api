import { IClassQuery } from '../../interfaces';
import prisma from '../../prisma';

export const dashClassService = async (
  class_id: string,
  school_id: string,
  year_id: string,
  { month }: IClassQuery,
) => {
  let whereData = {};

  if (month)
    whereData = {
      ...whereData,
      month: { name: { contains: month, mode: 'insensitive' } },
    };

  whereData = {
    ...whereData,
    status: 'CLOSED',
    year_id,
    class_id,
    school_id,
  };

  const [frequencies, { infreq: class_infreq }, frequencyOpen, stundents] =
    await Promise.all([
      prisma.frequency.count({
        where: {
          ...whereData,
        },
      }),
      prisma.classSchool.findUnique({
        where: { class_id_school_id_year_id: { class_id, school_id, year_id } },
        select: { infreq: true },
      }),
      prisma.frequency.count({
        where: { school_id, class_id, year_id, status: 'OPENED' },
      }),
      prisma.classStudent.count({
        where: { school_id, year_id, class_id, is_active: true },
      }),
    ]);

  return { frequencies, class_infreq, frequencyOpen, stundents };
};
