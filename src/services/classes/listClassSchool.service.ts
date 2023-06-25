import { IClassQuery } from '../../interfaces';
import prisma from '../../prisma';
import { ClassSchoolArraySchema } from '../../schemas';

export const listClassSchoolService = async (
  year_id: string,
  { take, skip, infreq, school_id, is_active, order, by, name }: IClassQuery,
) => {
  if (take) take = +take;
  if (skip) skip = +skip;

  let whereData = {};
  let whereClass = {};
  let whereSchool = {};
  let orderBy = {};

  if (name) {
    whereClass = {
      ...whereClass,
      name: { contains: name, mode: 'insensitive' },
    };
    whereSchool = {
      ...whereSchool,
      name: { contains: name, mode: 'insensitive' },
    };
    whereData = {
      ...whereData,
      class: { ...whereClass },
      school: { ...whereSchool },
    };
  }

  if (order) {
    switch (order) {
    case 'name':
      orderBy = { class: { name: by } };
      break;

    case 'infreq':
      orderBy = { infrequency: by };
      break;

    case 'school_name':
      orderBy = { school: { name: by } };
      break;
    }
  }

  if (infreq) {
    infreq = +infreq;
    whereData = { ...whereData, infrequency: { gte: infreq } };
  }

  if (is_active) {
    switch (is_active) {
    case 'true':
      whereClass = { ...whereClass, is_active: true };
      whereSchool = { ...whereSchool, is_active: true };
      whereData = {
        ...whereData,
        class: { ...whereClass },
        school: { ...whereSchool },
      };
      break;

    case 'false':
      whereClass = { ...whereClass, is_active: false };
      whereSchool = { ...whereSchool, is_active: false };
      whereData = {
        ...whereData,
        class: { ...whereClass },
        school: { ...whereSchool },
      };
      break;
    }
  }

  if (school_id) whereData = { ...whereData, school_id };

  whereData = { ...whereData, year_id };

  const [classes, total] = await Promise.all([
    prisma.classSchool.findMany({
      take,
      skip,
      where: {
        ...whereData,
      },
      orderBy,
      include: {
        class: true,
        school: true,
        _count: {
          select: {
            frequencies: { where: { status: 'CLOSED' } },
            students: { where: { is_active: true } },
          },
        },
      },
    }),
    prisma.classSchool.count({
      where: {
        ...whereData,
      },
    }),
  ]);

  const classesSchema = ClassSchoolArraySchema.parse(classes);

  return {
    total,
    result: classesSchema,
  };
};
