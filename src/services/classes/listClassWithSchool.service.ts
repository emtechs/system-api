import { IClassQuery } from '../../interfaces';
import prisma from '../../prisma';
import { classParseFrequency } from '../../scripts';

export const listClassWithSchoolService = async (
  school_id: string,
  { is_active }: IClassQuery,
) => {
  let classes = await prisma.classSchool.findMany({
    where: { school_id },
    orderBy: { class: { name: 'asc' } },
    include: {
      class: true,
      students: true,
      _count: { select: { frequencies: true, students: true } },
    },
  });

  if (is_active) {
    switch (is_active) {
    case 'true':
      classes = await prisma.classSchool.findMany({
        where: { AND: { school_id, class: { is_active: true } } },
        orderBy: { class: { name: 'asc' } },
        include: {
          class: true,
          students: true,
          _count: { select: { frequencies: true, students: true } },
        },
      });
      break;
    case 'false':
      classes = await prisma.classSchool.findMany({
        where: { AND: { school_id, class: { is_active: true } } },
        orderBy: { class: { name: 'asc' } },
        include: {
          class: true,
          students: true,
          _count: { select: { frequencies: true, students: true } },
        },
      });
      break;
    }
  }

  return await classParseFrequency(classes);
};
