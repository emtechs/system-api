import { IClassQuery } from '../../interfaces';
import prisma from '../../prisma';
import { ClassSchoolArraySchema } from '../../schemas';

export const listClassSchoolService = async (
  year_id: string,
  { take, skip, infreq, school_id, is_active, order, by }: IClassQuery,
) => {
  if (take) take = +take;
  if (skip) skip = +skip;

  let whereData = {};
  let orderBy = {};

  if (order) {
    switch (order) {
    case 'name':
      orderBy = { class: { name: by } };
      break;

    case 'infreq':
      orderBy = { infreq: by };
      break;
    }
  }

  if (infreq) {
    infreq = +infreq;
    whereData = { ...whereData, infreq: { gte: infreq } };
  }

  if (is_active) {
    switch (is_active) {
    case 'true':
      whereData = { ...whereData, class: { is_active: true } };
      break;

    case 'false':
      whereData = { ...whereData, class: { is_active: false } };
      break;
    }
  }

  if (school_id) {
    whereData = { ...whereData, school_id };
  }

  whereData = { ...whereData, year_id };

  const classes = await prisma.classSchool.findMany({
    take,
    skip,
    where: {
      ...whereData,
    },
    orderBy,
    include: {
      class: true,
      _count: {
        select: {
          frequencies: { where: { status: 'CLOSED' } },
          students: { where: { is_active: true } },
        },
      },
    },
  });

  const classesSchema = ClassSchoolArraySchema.parse(classes);

  const total = await prisma.classSchool.count({
    where: {
      ...whereData,
    },
  });

  return {
    total,
    result: classesSchema,
  };
};
