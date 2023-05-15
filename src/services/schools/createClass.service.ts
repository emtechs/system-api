import prisma from '../../prisma';
import { IClassRequest } from '../../interfaces';
import { ClassReturnSchema } from '../../schemas';

export const createClassService = async (
  { name }: IClassRequest,
  school_id: string,
) => {
  const classData = await prisma.class.create({ data: { name, school_id } });

  return ClassReturnSchema.parse(classData);
};
