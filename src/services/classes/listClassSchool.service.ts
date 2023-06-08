import { IClassQuery } from '../../interfaces';
import prisma from '../../prisma';
import {
  ClassSchoolArraySchema,
  ClassSchoolFrequencyArraySchema,
} from '../../schemas';
import { classArrParseFrequency } from '../../scripts';

export const listClassSchoolService = async (
  school_id: string,
  { is_active, year_id, class_infreq, is_dash, date, take }: IClassQuery,
) => {
  if (take) {
    take = +take;
  }

  if (is_dash) {
    const classes = await prisma.classSchool.findMany({
      take,
      where: {
        AND: {
          school_id,
          class: { is_active: true },
          frequencies: { none: { date, status: 'CLOSED' } },
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
    });
    return ClassSchoolArraySchema.parse(classes);
  }

  let classes = await prisma.classSchool.findMany({
    take,
    where: {
      AND: {
        school_id,
        class_infreq: { gte: Number(class_infreq ? class_infreq : 0) },
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
  });

  if (year_id) {
    classes = await prisma.classSchool.findMany({
      take,
      where: {
        AND: {
          school_id,
          year_id,
          class_infreq: { gte: Number(class_infreq ? class_infreq : 0) },
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
    });
  }

  if (is_active) {
    switch (is_active) {
    case 'true':
      classes = await prisma.classSchool.findMany({
        take,
        where: {
          AND: {
            school_id,
            class: { is_active: true },
            class_infreq: { gte: Number(class_infreq ? class_infreq : 0) },
          },
        },
        orderBy: { class: { name: 'asc' } },
        include: {
          school: true,
          year: true,
          class: true,
          students: {
            where: { is_active: true },
            include: { student: true },
          },
          _count: {
            select: {
              frequencies: { where: { status: 'CLOSED' } },
              students: true,
            },
          },
        },
      });
      break;
    case 'false':
      classes = await prisma.classSchool.findMany({
        take,
        where: {
          AND: {
            school_id,
            class: { is_active: true },
            class_infreq: { gte: Number(class_infreq ? class_infreq : 0) },
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
      });
      break;
    }
  }

  if (year_id) {
    const classesReturn = await classArrParseFrequency(classes, year_id);

    return ClassSchoolFrequencyArraySchema.parse(classesReturn);
  }

  return ClassSchoolArraySchema.parse(classes);
};
