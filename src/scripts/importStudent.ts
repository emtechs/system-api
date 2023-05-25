import { IStudent } from '../interfaces';
import prisma from '../prisma';

const verifyStudent = async ({
  name,
  registry,
  class_id,
  school_id,
}: IStudent) => {
  const studentData = await prisma.student.findUnique({
    where: { registry },
  });
  let student = studentData;
  if (!studentData) {
    student = await prisma.student.create({
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
  }
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
