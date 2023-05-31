import { IStudentUpdate } from '../interfaces';
import prisma from '../prisma';

const verifyStudent = async ({ id, infreq }: IStudentUpdate) => {
  const student = await prisma.student.update({
    where: { id },
    data: { infreq: +infreq },
  });

  return student;
};

export const updateStudent = async (students: IStudentUpdate[]) => {
  const studentsVerifyParse = students.map((el) => {
    return verifyStudent(el);
  });
  return Promise.all(studentsVerifyParse).then((student) => {
    return student;
  });
};
