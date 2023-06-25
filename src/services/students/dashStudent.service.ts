import { ICalendarQuery } from '../../interfaces';
import prisma from '../../prisma';

export const dashStudentService = async (
  student_id: string,
  { month }: ICalendarQuery,
) => {
  let whereData = {};

  if (month)
    whereData = {
      ...whereData,
      month: { name: { contains: month, mode: 'insensitive' } },
    };

  whereData = {
    ...whereData,
    students: { every: { student_id } },
    status: 'CLOSED',
  };

  const [frequencies, { infreq: stundent_infreq }, frequencyOpen, stundents] =
    await Promise.all([
      prisma.frequency.count({
        where: { ...whereData },
      }),
      prisma.student.findUnique({
        where: { id: student_id },
        select: { infreq: true },
      }),
      prisma.frequency.count({
        where: { school_id, class_id, year_id, status: 'OPENED' },
      }),
      prisma.classStudent.count({
        where: { school_id, year_id, class_id, is_active: true },
      }),
    ]);

  return { frequencies, stundent_infreq, frequencyOpen, stundents };
};
