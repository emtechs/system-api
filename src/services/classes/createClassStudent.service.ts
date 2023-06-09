import prisma from '../../prisma';
import { IClassStudentRequest } from '../../interfaces';

export const createClassStudentService = async (
  { school_id, year_id, student_id }: IClassStudentRequest,
  class_id: string,
) => {
  const classStudent = await prisma.classStudent.create({
    data: {
      class: {
        connectOrCreate: {
          where: {
            class_id_school_id_year_id: {
              class_id,
              school_id,
              year_id,
            },
          },
          create: { class_id, school_id, year_id },
        },
      },
      student: { connect: { id: student_id } },
    },
  });

  return classStudent;
};
