import { ITransferClassStudentRequest } from '../../interfaces'
import { prisma } from '../../lib'

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
    prisma.classStudent.upsert({
      where: {
        class_id_school_id_year_id_student_id: {
          class_id,
          school_id,
          student_id,
          year_id,
        },
      },
      create: { class_id, school_id, student_id, year_id },
      update: { is_active: true },
    }),
  ])

  return { oldClass, newClass }
}
