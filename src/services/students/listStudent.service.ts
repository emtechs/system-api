import { Student } from '@prisma/client';
import { IStudentQuery } from '../../interfaces';
import prisma from '../../prisma';
import { studentsParseFrequency } from '../../scripts';
import { StudentArraySchema } from '../../schemas';

export const listStudentService = async ({
  year_id,
  school_id,
  take,
  is_active,
  skip,
  is_list,
  infreq,
}: IStudentQuery) => {
  if (take) take = +take;
  if (skip) skip = +skip;
  if (infreq) infreq = +infreq;

  let whereClassesEvery = {};

  if (is_list) {
    const [students, total] = await Promise.all([
      prisma.student.findMany({
        take,
        skip,
        where: {
          infrequencies: {
            every: { value: { gte: infreq ? infreq : 0 }, year_id },
          },
        },
        orderBy: { name: 'asc' },
        include: {
          classes: {
            where: { AND: { year_id, is_active: true } },
            include: {
              class: { include: { class: true, school: true, year: true } },
            },
          },
        },
      }),
      prisma.student.count({
        where: {
          infrequencies: { every: { value: { gte: infreq ? infreq : 0 } } },
        },
      }),
    ]);

    const studentsSchema = StudentArraySchema.parse(students);

    return {
      total,
      result: studentsSchema,
    };
  }

  let students: Student[];
  let total: number;

  if (is_active) {
    switch (is_active) {
    case 'true':
      whereClassesEvery = { ...whereClassesEvery, is_active: true };
      break;

    case 'false':
      whereClassesEvery = { ...whereClassesEvery, is_active: false };
      break;
    }
  }

  if (school_id) whereClassesEvery = { ...whereClassesEvery, school_id };

  if (year_id) {
    [students, total] = await Promise.all([
      prisma.student.findMany({
        take,
        skip,
        where: {
          classes: { every: { school_id } },
          infrequencies: { every: { value: { gt: 0 } } },
        },
        include: { infrequencies: { orderBy: { value: 'desc' } } },
      }),
      prisma.student.count({
        where: {
          classes: { every: { school_id } },
          infrequencies: { every: { value: { gt: 0 } } },
        },
      }),
    ]);

    const studentsReturn = await studentsParseFrequency(students, year_id);

    return {
      total,
      result: studentsReturn,
    };
  }

  [students, total] = await Promise.all([
    prisma.student.findMany({
      take,
      skip,
      where: { classes: { every: { ...whereClassesEvery } } },
      orderBy: { name: 'asc' },
    }),
    prisma.student.count({
      where: { classes: { every: { ...whereClassesEvery } } },
    }),
  ]);

  const studentsSchema = StudentArraySchema.parse(students);

  return {
    total,
    result: studentsSchema,
  };
};
