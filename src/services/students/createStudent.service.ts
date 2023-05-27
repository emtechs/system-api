import prisma from '../../prisma';
import { IStudentRequest } from '../../interfaces';

export const createStudentService = async ({
  name,
  registry,
}: IStudentRequest) => {
  const student = await prisma.student.create({
    data: {
      name,
      registry,
    },
  });

  return student;
};
