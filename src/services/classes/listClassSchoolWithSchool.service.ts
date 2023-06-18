import { IClassQuery } from '../../interfaces';
import prisma from '../../prisma';
import {
  ClassSchoolArraySchema,
  ClassSchoolFrequencyArraySchema,
} from '../../schemas';
import { classArrParseFrequency } from '../../scripts';

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

  if (is_dash) {
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

    const [classes, total] = await Promise.all([
      prisma.classSchool.findMany({
        take,
        skip,
        where: {
          AND: {
            school_id,
            class: { is_active: true },
            frequencies: { none: { date, status: 'CLOSED' } },
          },
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
          AND: {
            school_id,
            class: { is_active: true },
            frequencies: { none: { date, status: 'CLOSED' } },
          },
        },
      }),
    ]);

    const classesSchema = ClassSchoolArraySchema.parse(classes);

    return {
      total,
      result: classesSchema,
    };
  }

  if (year_id) {
    if (is_active) {
      const [classes, total] = await Promise.all([
        prisma.classSchool.findMany({
          take,
          skip,
          where: {
            AND: {
              class: { is_active: true },
              school_id,
              year_id,
              infreq: { gte: Number(infreq ? infreq : 0) },
            },
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
            AND: {
              class: { is_active: true },
              school_id,
              year_id,
              infreq: { gte: Number(infreq ? infreq : 0) },
            },
          },
        }),
      ]);

      const classesReturn = await classArrParseFrequency(classes, year_id);

      const classesSchema =
        ClassSchoolFrequencyArraySchema.parse(classesReturn);

      return {
        total,
        result: classesSchema,
      };
    }

    const [classes, total] = await Promise.all([
      prisma.classSchool.findMany({
        take,
        skip,
        where: {
          AND: {
            school_id,
            year_id,
            infreq: { gte: Number(infreq ? infreq : 0) },
          },
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
          AND: {
            school_id,
            year_id,
            infreq: { gte: Number(infreq ? infreq : 0) },
          },
        },
      }),
    ]);

    const classesReturn = await classArrParseFrequency(classes, year_id);

    const classesSchema = ClassSchoolFrequencyArraySchema.parse(classesReturn);

    return {
      total,
      result: classesSchema,
    };
  }

  const [classes, total] = await Promise.all([
    prisma.classSchool.findMany({
      take,
      skip,
      where: {
        AND: {
          school_id,
          infreq: { gte: Number(infreq ? infreq : 0) },
        },
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
        AND: {
          school_id,
          infreq: { gte: Number(infreq ? infreq : 0) },
        },
      },
    }),
  ]);

  const classesSchema = ClassSchoolArraySchema.parse(classes);

  return {
    total,
    result: classesSchema,
  };
};
