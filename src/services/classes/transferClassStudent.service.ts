import { ITransferClassStudentRequest } from '../../interfaces';
import prisma from '../../prisma';

export const transferClassStudentService = async ({
  finished_at,
  justify_disabled,
  key,
  school_id,
  student_id,
  year_id,
  class_id,
}: ITransferClassStudentRequest) => {
  const [oldClass, newClass] = await Promise.all([
    prisma.classStudent.update({
      where: { key },
      data: { is_active: false, finished_at, justify_disabled },
    }),
    prisma.classStudent.create({
      data: { class_id, school_id, year_id, student_id },
    }),
  ]);

  return { oldClass, newClass };
};
