import prisma from '../../prisma';
import { IClassStudentUpdate } from '../../interfaces';

export const updateClassStudentService = async (
  {
    school_id,
    year_id,
    student_id,
    finished_at,
    is_active,
    justify_disabled,
  }: IClassStudentUpdate,
  class_id: string,
) => {
  const classStudent = await prisma.classStudent.update({
    where: {
      class_id_school_id_year_id_student_id: {
        class_id,
        school_id,
        student_id,
        year_id,
      },
    },
    data: { finished_at, justify_disabled, is_active },
  });

  return classStudent;
};
