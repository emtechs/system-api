import prisma from '../../prisma';
import { IStudentRequest } from '../../interfaces';

export const createStudentService = async (
  { name, registry, class_id }: IStudentRequest,
  school_id: string,
) => {
  const student = await prisma.student.create({
    data: {
      name,
      registry,
      class: {
        connectOrCreate: {
          where: { class_id_school_id: { class_id, school_id } },
          create: { class_id, school_id },
        },
      },
    },
  });

  return student;
};
