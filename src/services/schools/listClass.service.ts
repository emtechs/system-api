import { IClassQuery } from '../../interfaces';
import prisma from '../../prisma';
import { ClassArraySchema } from '../../schemas';

export const listClassService = async ({ school_id }: IClassQuery) => {
  let classes = await prisma.class.findMany({
    include: { students: true, school: true },
  });

  classes = school_id
    ? classes.filter((el) => school_id === el.school_id)
    : classes;

  return ClassArraySchema.parse(classes);
};
