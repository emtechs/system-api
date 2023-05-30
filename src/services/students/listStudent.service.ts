import { IStudentQuery } from '../../interfaces';
import prisma from '../../prisma';
import { studentsParseFrequency } from '../../scripts';

export const listStudentService = async ({
  school_year_id,
  school_id,
  take,
}: IStudentQuery) => {
  if (take) {
    take = +take;
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

  if (school_year_id) {
    students = await prisma.student.findMany({
      take,
      where: { AND: { classes: { every: { school_id } }, infreq: { gt: 0 } } },
      orderBy: { infreq: 'desc' },
    });
    return await studentsParseFrequency(students, school_year_id);
  }

  return students;
};
