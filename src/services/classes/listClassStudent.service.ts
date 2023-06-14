import { IClassQuery } from '../../interfaces';
import prisma from '../../prisma';
import { studentClassParseFrequency } from '../../scripts';

export const listClassStudentService = async (
  class_id: string,
  school_id: string,
  year_id: string,
  { by, skip, order, name, infreq, take }: IClassQuery,
) => {
  if (take) take = +take;
  if (skip) skip = +skip;

  let whereData = {};
  let whereStudent = {};
  let orderBy = {};

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
      infreq: { gte: infreq },
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

    case 'infreq':
      orderBy = { student: { infreq: by } };
      break;
    }
  }

  whereData = { ...whereData, class_id, school_id, is_active: true, year_id };

  const classStudent = await prisma.classStudent.findMany({
    take,
    skip,
    where: {
      ...whereData,
    },
    include: { student: true },
    orderBy,
  });

  const classesSchema = await studentClassParseFrequency(classStudent, year_id);

  const total = await prisma.classStudent.count({
    where: {
      ...whereData,
    },
  });

  return {
    total,
    result: classesSchema,
  };
};
