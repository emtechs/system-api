import { IStudentUpdate } from '../interfaces';
import prisma from '../prisma';

const verifyStudent = async (
  { id, infreq }: IStudentUpdate,
  year_id: string,
) => {
  const student = await prisma.student.update({
    where: { id },
    data: {
      infrequencies: {
        upsert: {
          where: { year_id_student_id: { student_id: id, year_id } },
          create: { value: infreq, year_id },
          update: { value: infreq },
        },
      },
    },
  });

  return student;
};

export const updateStudent = async (
  students: IStudentUpdate[],
  year_id: string,
) => {
  const studentsVerifyParse = students.map((el) => {
    return verifyStudent(el, year_id);
  });
  return Promise.all(studentsVerifyParse).then((student) => {
    return student;
  });
};
