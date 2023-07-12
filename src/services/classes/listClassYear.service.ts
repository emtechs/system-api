import { IClassQuery } from '../../interfaces';
import prisma from '../../prisma';
import { classYearArrayReturn } from '../../scripts';

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

  const [classesData, total, classesLabel] = await Promise.all([
    prisma.classYear.findMany({
      take,
      skip,
      where,
      orderBy,
      select: {
        class_id: true,
        school_id: true,
        year_id: true,
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
      },
    }),
  ]);

  const classes = classesLabel.map((el) => {
    const { id, name } = el.class;

    return { id, name, label: name, school: el.school, year_id };
  });

  return {
    classes,
    total,
    result: await classYearArrayReturn(classesData),
  };
};
