import { IClassQuery } from '../../interfaces';
import prisma from '../../prisma';
import {
  ClassSchoolArraySchema,
  ClassSchoolFrequencyArraySchema,
} from '../../schemas';
import { classArrParseFrequency } from '../../scripts';

export const listClassWithSchoolService = async (
  school_id: string,
  { is_active, school_year_id, class_infreq, is_dash, date }: IClassQuery,
) => {
  if (is_dash) {
    const classes = await prisma.classSchool.findMany({
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
        school_year: true,
        class: true,
        students: { include: { student: true } },
        _count: { select: { frequencies: true, students: true } },
      },
    });
    return ClassSchoolArraySchema.parse(classes);
  }

  let classes = await prisma.classSchool.findMany({
    where: {
      AND: {
        school_id,
        class_infreq: { gte: Number(class_infreq ? class_infreq : 0) },
      },
    },
    orderBy: { class: { name: 'asc' } },
    include: {
      school: true,
      school_year: true,
      class: true,
      students: { include: { student: true } },
      _count: { select: { frequencies: true, students: true } },
    },
  });

  if (school_year_id) {
    classes = await prisma.classSchool.findMany({
      where: {
        AND: {
          school_id,
          school_year_id,
          class_infreq: { gte: Number(class_infreq ? class_infreq : 0) },
        },
      },
      orderBy: { class: { name: 'asc' } },
      include: {
        school: true,
        school_year: true,
        class: true,
        students: { include: { student: true } },
        _count: { select: { frequencies: true, students: true } },
      },
    });
  }

  if (is_active) {
    switch (is_active) {
    case 'true':
      classes = await prisma.classSchool.findMany({
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
          school_year: true,
          class: true,
          students: { include: { student: true } },
          _count: { select: { frequencies: true, students: true } },
        },
      });
      break;
    case 'false':
      classes = await prisma.classSchool.findMany({
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
          school_year: true,
          class: true,
          students: { include: { student: true } },
          _count: { select: { frequencies: true, students: true } },
        },
      });
      break;
    }
  }

  if (school_year_id) {
    const classesReturn = await classArrParseFrequency(classes, school_year_id);

    return ClassSchoolFrequencyArraySchema.parse(classesReturn);
  }

  return ClassSchoolArraySchema.parse(classes);
};
