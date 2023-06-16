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

  const frequencies = await prisma.frequency.count({
    where: {
      ...whereData,
    },
  });

  const { infreq: class_infreq } = await prisma.classSchool.findUnique({
    where: { class_id_school_id_year_id: { class_id, school_id, year_id } },
    select: { infreq: true },
  });

  const frequencyOpen = await prisma.frequency.count({
    where: { school_id, class_id, year_id, status: 'OPENED' },
  });

  const stundents = await prisma.classStudent.count({
    where: { school_id, year_id, class_id, is_active: true },
  });

  return { frequencies, class_infreq, frequencyOpen, stundents };
};
