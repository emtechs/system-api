import prisma from '../../prisma';
import { IStudentWithClassRequest } from '../../interfaces';

export const createStudentWithClassService = async (
  { name, registry, class_id, school_id }: IStudentWithClassRequest,
  school_year_id: string,
) => {
  const student = await prisma.student.create({
    data: {
      name,
      registry,
    },
  });

  await prisma.student.update({
    where: { registry },
    data: {
      classes: {
        connectOrCreate: {
          where: {
            class_id_school_id_school_year_id_student_id: {
              class_id,
              school_id,
              school_year_id,
              student_id: student.id,
            },
          },
          create: {
            class: {
              connectOrCreate: {
                where: {
                  class_id_school_id_school_year_id: {
                    class_id,
                    school_id,
                    school_year_id,
                  },
                },
                create: { class_id, school_id, school_year_id },
              },
            },
          },
        },
      },
    },
  });

  return student;
};
