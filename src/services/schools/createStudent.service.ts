import prisma from '../../prisma';
import { IStudentRequest } from '../../interfaces';
import { UserReturnSchema } from '../../schemas';

export const createStudentService = async (
  { name, registry, class_id }: IStudentRequest,
  school_id: string,
) => {
  const student = await prisma.student.create({
    data: { name, registry, class_id, school_id },
  });

  return student;
};
