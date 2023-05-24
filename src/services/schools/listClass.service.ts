import { IClassQuery } from '../../interfaces';
import prisma from '../../prisma';
import { classParseFrequency } from '../../scripts';

export const listClassService = async ({
  is_active,
  school_id,
}: IClassQuery) => {
  let classes = await prisma.class.findMany({
    orderBy: { name: 'asc' },
    include: { _count: true, students: true, school: true },
  });

  if (is_active) {
    switch (is_active) {
    case 'true':
      classes = classes.filter((el) => el.is_active === true);
      break;
    case 'false':
      classes = classes.filter((el) => el.is_active === false);
      break;
    }
  }

  classes = school_id
    ? classes.filter((el) => school_id === el.school_id)
    : classes;

  return classParseFrequency(classes);

  // return ClassArraySchema.parse(classes);
};
