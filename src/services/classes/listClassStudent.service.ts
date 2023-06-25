import { IClassQuery } from '../../interfaces';
import prisma from '../../prisma';
import { ClassStudentArraySchema } from '../../schemas';
import { studentClassParseFrequency } from '../../scripts';

export const listClassStudentService = async (
  year_id: string,
  {
    by,
    skip,
    order,
    name,
    infreq,
    take,
    is_infreq,
    class_id,
    school_id,
  }: IClassQuery,
) => {
  if (take) take = +take;
  if (skip) skip = +skip;

  let whereData = {};
  let whereStudent = {};
  let orderBy = {};
  let orderByStudent = {};

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

    case 'infreq':
      orderBy = { student: { name: by } };
      orderByStudent = { value: by };
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
      include: {
        student: { include: { infrequencies: { orderBy: orderByStudent } } },
        class: { include: { class: true, school: true } },
      },
      orderBy,
    }),
    prisma.classStudent.count({
      where: {
        ...whereData,
      },
    }),
  ]);

  if (is_infreq) {
    const classesSchema = await studentClassParseFrequency(
      classStudent,
      year_id,
    );

    return {
      total,
      result: classesSchema,
    };
  }

  const classesSchema = ClassStudentArraySchema.parse(classStudent);

  return {
    total,
    result: classesSchema,
  };
};
