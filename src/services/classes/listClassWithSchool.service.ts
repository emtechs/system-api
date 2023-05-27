import { IClassQuery } from '../../interfaces';
import prisma from '../../prisma';
import {
  ClassSchoolArraySchema,
  ClassSchoolFrequencyArraySchema,
} from '../../schemas';
import { classParseFrequency } from '../../scripts';

export const listClassWithSchoolService = async (
  school_id: string,
  { is_active, school_year_id }: IClassQuery,
) => {
  let classes = await prisma.classSchool.findMany({
    where: { school_id },
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
      where: { AND: { school_id, school_year_id } },
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
        where: { AND: { school_id, class: { is_active: true } } },
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
        where: { AND: { school_id, class: { is_active: true } } },
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
    const classesReturn = await classParseFrequency(classes, school_year_id);

    return ClassSchoolFrequencyArraySchema.parse(classesReturn);
  }

  return ClassSchoolArraySchema.parse(classes);
};
