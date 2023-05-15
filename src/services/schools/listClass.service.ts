import prisma from '../../prisma';
import { ClassArraySchema } from '../../schemas';

export const listClassService = async () => {
  const classes = await prisma.class.findMany({});
  return ClassArraySchema.parse(classes);
};
