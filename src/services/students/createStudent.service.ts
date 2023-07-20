import prisma from '../../prisma';
import { IQuery, IStudentRequest } from '../../interfaces';
import { AppError } from '../../errors';

export const createStudentService = async (
  { name, registry }: IStudentRequest,
  { key_class }: IQuery,
) => {
  const student_data = await prisma.student.findUnique({ where: { registry } });

  if (student_data) throw new AppError('student already exists', 409);

  if (key_class) {
    const student = await prisma.classYear.update({
      where: { key: key_class },
      data: {
        students: { create: { student: { create: { name, registry } } } },
      },
    });

    return student;
  }

  const student = await prisma.student.create({
    data: {
      name,
      registry,
    },
  });

  return student;
};
