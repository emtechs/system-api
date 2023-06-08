import { IStudentQuery } from '../../interfaces';
import prisma from '../../prisma';
import { studentsParseFrequency } from '../../scripts';

export const listStudentService = async ({
  year_id,
  school_id,
  take,
  is_active,
}: IStudentQuery) => {
  if (take) {
    take = +take;
  }

  if (is_active) {
    switch (is_active) {
    case 'true':
      return await prisma.student.findMany({
        take,
        where: { classes: { every: { is_active: true } } },
      });

    case 'false':
      return await prisma.student.findMany({
        take,
        where: { classes: { every: { is_active: false } } },
      });
    }
  }

  let students = await prisma.student.findMany({
    orderBy: { name: 'asc' },
  });

  if (school_id) {
    students = await prisma.student.findMany({
      where: { classes: { every: { school_id } } },
      orderBy: { name: 'asc' },
    });
  }

  if (year_id) {
    students = await prisma.student.findMany({
      take,
      where: { AND: { classes: { every: { school_id } }, infreq: { gt: 0 } } },
      orderBy: { infreq: 'desc' },
    });
    return await studentsParseFrequency(students, year_id);
  }

  return students;
};
