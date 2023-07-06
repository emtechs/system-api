import { IClassQuery } from '../../interfaces';
import prisma from '../../prisma';

export const listClassStudentService = async (
  year_id: string,
  { by, skip, order, name, infreq, take, class_id, school_id }: IClassQuery,
) => {
  if (take) take = +take;
  if (skip) skip = +skip;

  let whereData = {};
  let whereStudent = {};
  let orderBy = {};

  if (class_id) whereData = { ...whereData, class_id };

  if (school_id) whereData = { ...whereData, school_id };

  if (name) {
    whereStudent = {
      ...whereStudent,
      name: { contains: name, mode: 'insensitive' },
    };
    whereData = { ...whereData, student: whereStudent };
  }

  if (infreq) {
    infreq = +infreq;
    whereStudent = {
      ...whereStudent,
      infrequencies: { every: { value: { gte: 0 }, year_id } },
    };
    whereData = { ...whereData, student: whereStudent };
  }

  if (order) {
    switch (order) {
    case 'name':
      orderBy = { student: { name: by } };
      break;

    case 'registry':
      orderBy = { student: { registry: by } };
      break;
    }
  }

  whereData = { ...whereData, is_active: true, year_id };

  const [classStudent, total] = await Promise.all([
    prisma.classStudent.findMany({
      take,
      skip,
      where: {
        ...whereData,
      },
      select: { student: { select: { id: true, name: true, registry: true } } },
      orderBy,
    }),
    prisma.classStudent.count({
      where: {
        ...whereData,
      },
    }),
  ]);

  const students = classStudent.map((el) => {
    return {
      id: el.student.id,
      name: el.student.name,
      registry: el.student.registry,
    };
  });

  return {
    total,
    result: students,
  };
};
