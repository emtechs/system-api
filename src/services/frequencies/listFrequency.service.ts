import { IFrequencyQuery } from '../../interfaces';
import prisma from '../../prisma';
import { frequencyReturn } from '../../scripts';

export const listFrequencyService = async ({
  take,
  skip,
  status,
  date,
  class_id,
  school_id,
  year_id,
  order,
  by,
}: IFrequencyQuery) => {
  if (take) take = +take;
  if (skip) skip = +skip;

  let where = {};
  let orderBy = {};

  if (order) {
    switch (order) {
    case 'created_at':
      orderBy = { created_at: by };
      break;

    case 'date':
      orderBy = { date_time: by };
      break;

    case 'finished_at':
      orderBy = { finished_at: by };
      break;

    case 'infreq':
      orderBy = { infrequency: by };
      break;
    }
  }

  if (status) where = { ...where, status };
  if (date) where = { ...where, date };
  if (class_id) where = { ...where, class_id };
  if (school_id) where = { ...where, school_id };
  if (year_id) where = { ...where, year_id };

  const [frequencies, total] = await Promise.all([
    prisma.frequency.findMany({
      take,
      skip,
      where,
      select: {
        id: true,
        date: true,
        status: true,
        infrequency: true,
        class: {
          select: {
            class: { select: { id: true, name: true } },
            school: { select: { id: true, name: true } },
          },
        },
        _count: { select: { students: true } },
      },
      orderBy,
    }),
    prisma.frequency.count({
      where,
    }),
  ]);

  return {
    total,
    result: frequencyReturn(frequencies),
  };
};
