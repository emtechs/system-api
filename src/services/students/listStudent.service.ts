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

  if (is_list) {
    const students = await prisma.student.findMany({
      take,
      skip,
      where: { infreq: { gte: infreq ? infreq : 0 } },
      orderBy: { name: 'asc' },
      include: {
        classes: {
          where: { AND: { year_id, is_active: true } },
          include: {
            class: { include: { class: true, school: true, year: true } },
          },
        },
      },
    });

    const studentsSchema = StudentArraySchema.parse(students);

    const total = await prisma.student.count({
      where: { infreq: { gte: infreq ? infreq : 0 } },
    });

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
      students = await prisma.student.findMany({
        take,
        skip,
        where: { classes: { every: { is_active: true } } },
        orderBy: { name: 'asc' },
      });

      total = await prisma.student.count({
        where: { classes: { every: { is_active: true } } },
      });

      return {
        total,
        result: students,
      };

    case 'false':
      students = await prisma.student.findMany({
        take,
        skip,
        where: { classes: { every: { is_active: false } } },
        orderBy: { name: 'asc' },
      });

      total = await prisma.student.count({
        where: { classes: { every: { is_active: false } } },
      });

      return {
        total,
        result: students,
      };
    }
  }

  if (school_id) {
    students = await prisma.student.findMany({
      take,
      skip,
      where: { classes: { every: { school_id } } },
      orderBy: { name: 'asc' },
    });

    total = await prisma.student.count({
      where: { classes: { every: { school_id } } },
    });

    return {
      total,
      result: students,
    };
  }

  if (year_id) {
    students = await prisma.student.findMany({
      take,
      skip,
      where: { AND: { classes: { every: { school_id } }, infreq: { gt: 0 } } },
      orderBy: { infreq: 'desc' },
    });

    const studentsReturn = await studentsParseFrequency(students, year_id);

    total = await prisma.student.count({
      where: { AND: { classes: { every: { school_id } }, infreq: { gt: 0 } } },
    });

    return {
      total,
      result: studentsReturn,
    };
  }

  students = await prisma.student.findMany({
    take,
    skip,
    orderBy: { name: 'asc' },
  });

  const studentsSchema = StudentArraySchema.parse(students);

  total = await prisma.student.count();

  return {
    total,
    result: studentsSchema,
  };
};
