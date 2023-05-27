import { IStudent } from '../interfaces';
import prisma from '../prisma';

const verifyStudent = async ({
  name,
  registry,
  class_id,
  school_id,
  school_year_id,
}: IStudent) => {
  let student = await prisma.student.findUnique({
    where: { registry },
  });

  if (!student) {
    student = await prisma.student.create({
      data: {
        name,
        registry,
      },
    });
  }

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

export const importStudent = async (students: IStudent[]) => {
  const studentsVerifyParse = students.map((el) => {
    return verifyStudent(el);
  });
  return Promise.all(studentsVerifyParse).then((student) => {
    return student;
  });
};
