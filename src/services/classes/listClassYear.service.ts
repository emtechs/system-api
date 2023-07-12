import { IClassQuery } from '../../interfaces';
import prisma from '../../prisma';
import { classYearReturn } from '../../scripts';

export const listClassYearService = async (
  year_id: string,
  { take, skip, infreq, school_id, order, by, name }: IClassQuery,
) => {
  if (take) take = +take;
  if (skip) skip = +skip;

  let where = {};
  let where_class = {};
  let orderBy = {};

  if (order) {
    switch (order) {
    case 'name':
      orderBy = { class: { name: by } };
      break;
    }
  }

  if (infreq) {
    infreq = +infreq;
    where = { ...where, infrequencies: { some: { value: { gte: infreq } } } };
  }

  where_class = { ...where_class, is_active: true };

  if (name)
    where_class = {
      ...where_class,
      name: { contains: name, mode: 'insensitive' },
    };

  if (school_id) where = { ...where, school_id };

  where = { ...where, class: { ...where_class }, year_id };

  const [classes, total, classesLabel] = await Promise.all([
    prisma.classYear.findMany({
      take,
      skip,
      where,
      orderBy,
      select: {
        class: { select: { id: true, name: true } },
        school: { select: { id: true, name: true } },
        infrequencies: {
          select: {
            value: true,
            period: { select: { name: true, category: true } },
          },
        },
        _count: {
          select: {
            students: { where: { is_active: true } },
            frequencies: { where: { status: 'CLOSED' } },
          },
        },
      },
    }),
    prisma.classYear.count({
      where,
    }),
    prisma.classYear.findMany({
      where,
      orderBy: { class: { name: 'asc' } },
      select: {
        class: { select: { id: true, name: true } },
        school: { select: { id: true, name: true } },
        infrequencies: {
          select: {
            value: true,
            period: { select: { name: true, category: true } },
          },
        },
        _count: {
          select: {
            students: { where: { is_active: true } },
            frequencies: { where: { status: 'CLOSED' } },
          },
        },
      },
    }),
  ]);

  return {
    classes: classYearReturn(classesLabel),
    total,
    result: classYearReturn(classes),
  };
};
