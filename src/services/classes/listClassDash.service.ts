import { IClassQuery } from '../../interfaces';
import prisma from '../../prisma';

export const listClassDashService = async (
  school_id: string,
  year_id: string,
  { is_active, infreq, date, take, skip, order, by }: IClassQuery,
) => {
  if (take) take = +take;
  if (skip) skip = +skip;

  let whereData = {};
  let orderBy = {};

  if (date) {
    const dateData = date.split('/');
    const date_time = new Date(`${dateData[2]}-${dateData[1]}-${dateData[0]}`);
    const whereInfrequencies = {
      every: {
        period: {
          category: 'ANO',
          date_initial: { lte: date_time },
          date_final: { gte: date_time },
          year_id,
        },
      },
    };
    whereData = { ...whereData, infrequencies: { ...whereInfrequencies } };
  }

  if (order) {
    switch (order) {
    case 'name':
      orderBy = { class: { name: by } };
      break;

    case 'infreq':
      orderBy = { infrequency: by };
      break;
    }
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

  if (year_id) whereData = { ...whereData, year_id };

  if (infreq) {
    infreq = +infreq;

    whereData = { ...whereData, infrequency: { gte: infreq } };
  }

  whereData = {
    ...whereData,
    class: { is_active: true },
    frequencies: { none: { date, status: 'CLOSED' } },
    school_id,
  };

  const [classes, total] = await Promise.all([
    prisma.classSchool.findMany({
      take,
      skip,
      where: {
        ...whereData,
      },
      orderBy,
      select: {
        class: { select: { id: true, name: true } },
        students: { select: { student_id: true } },
        infrequencies: { select: { value: true } },
        school_id: true,
        year_id: true,
        _count: { select: { students: true, frequencies: true } },
      },
    }),
    prisma.classSchool.count({
      where: {
        ...whereData,
      },
    }),
  ]);

  const classesData = classes.map((el) => {
    return {
      id: el.class.id,
      label: el.class.name,
      infrequency: el.infrequencies.length > 0 ? el.infrequencies[0].value : 0,
      ...el,
    };
  });

  return {
    classes: classesData,
    total,
    result: classesData,
  };
};
