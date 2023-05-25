import { IClassQuery } from '../../interfaces';
import prisma from '../../prisma';

export const listClassService = async ({ is_active }: IClassQuery) => {
  let classes = await prisma.class.findMany({
    orderBy: { name: 'asc' },
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

  return classes;
};
