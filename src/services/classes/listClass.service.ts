import { IClassQuery } from '../../interfaces';
import prisma from '../../prisma';
import { ClassArraySchema } from '../../schemas';
import { classArrayReturn } from '../../scripts';

export const listClassService = async ({
  is_active,
  take,
  skip,
  order,
  by,
  school_id,
  year_id,
  name,
}: IClassQuery) => {
  if (take) take = +take;
  if (skip) skip = +skip;

  let where = {};
  let orderBy = {};

  if (year_id && school_id)
    where = { ...where, schools: { none: { school_id, year_id } } };

  if (order) {
    switch (order) {
    case 'name':
      orderBy = { name: by };
      break;
    }
  }

  if (name) where = { ...where, name: { contains: name, mode: 'insensitive' } };

  if (is_active) {
    switch (is_active) {
    case 'true':
      where = { ...where, is_active: true };
      break;

    case 'false':
      where = { ...where, is_active: false };
      break;
    }
  }

  const [classes, total, classesLabel] = await Promise.all([
    prisma.class.findMany({
      take,
      skip,
      where,
      orderBy,
    }),
    prisma.class.count({ where }),
    prisma.class.findMany({
      where,
      orderBy: { name: 'asc' },
    }),
  ]);

  return {
    classes: ClassArraySchema.parse(classesLabel),
    total,
    result: ClassArraySchema.parse(await classArrayReturn(classes)),
  };
};
