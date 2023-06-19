import { IClassQuery } from '../../interfaces';
import prisma from '../../prisma';
import { ClassSchoolArraySchema } from '../../schemas';

export const listClassSchoolWithSchoolService = async (
  school_id: string,
  {
    is_active,
    year_id,
    infreq,
    is_dash,
    date,
    take,
    skip,
    order,
    by,
  }: IClassQuery,
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

    whereData = { ...whereData, infreq: { gte: infreq } };
  }

  whereData = { ...whereData, school_id };

  if (is_dash) {
    whereData = {
      ...whereData,
      class: { is_active: true },
      frequencies: { none: { date, status: 'CLOSED' } },
    };

    const [classes, total, classesLabel] = await Promise.all([
      prisma.classSchool.findMany({
        take,
        skip,
        where: {
          ...whereData,
        },
        orderBy,
        include: {
          school: true,
          year: true,
          class: true,
          students: {
            include: {
              student: { include: { classes: { where: { is_active: true } } } },
            },
          },
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
      prisma.classSchool.findMany({
        where: {
          ...whereData,
        },
        orderBy,
        include: {
          school: true,
          year: true,
          class: true,
          students: {
            include: {
              student: { include: { classes: { where: { is_active: true } } } },
            },
          },
          _count: {
            select: {
              frequencies: { where: { status: 'CLOSED' } },
              students: { where: { is_active: true } },
            },
          },
        },
      }),
    ]);

    const classesSchema = ClassSchoolArraySchema.parse(classes);

    const classesData = ClassSchoolArraySchema.parse(classesLabel).map((el) => {
      return {
        id: el.class.id,
        label: el.class.name,
        ...el,
      };
    });

    return {
      classes: classesData,
      total,
      result: classesSchema,
    };
  }

  const [classes, total, classesLabel] = await Promise.all([
    prisma.classSchool.findMany({
      take,
      skip,
      where: {
        ...whereData,
      },
      orderBy: { class: { name: 'asc' } },
      include: {
        school: true,
        year: true,
        class: true,
        students: { include: { student: true } },
        _count: {
          select: {
            frequencies: { where: { status: 'CLOSED' } },
            students: true,
          },
        },
      },
    }),
    prisma.classSchool.count({
      where: {
        ...whereData,
      },
    }),
    prisma.classSchool.findMany({
      where: {
        ...whereData,
      },
      orderBy: { class: { name: 'asc' } },
      include: {
        school: true,
        year: true,
        class: true,
        students: { include: { student: true } },
        _count: {
          select: {
            frequencies: { where: { status: 'CLOSED' } },
            students: true,
          },
        },
      },
    }),
  ]);

  const classesSchema = ClassSchoolArraySchema.parse(classes);

  const classesData = ClassSchoolArraySchema.parse(classesLabel).map((el) => {
    return {
      id: el.class.id,
      label: el.class.name,
      ...el,
    };
  });

  return {
    classes: classesData,
    total,
    result: classesSchema,
  };
};
