import { ITransferClassStudentRequest } from '../../interfaces'
import { prisma } from '../../lib'

export const transferClassStudentService = async ({
  justify_disabled,
  key,
  school_id,
  student_id,
  year_id,
  class_id,
}: ITransferClassStudentRequest) => {
  const newClass = await prisma.classStudent.update({
    where: { key },
    data: { class_id, school_id, student_id, year_id },
    include: { class_year: { select: { key: true } } },
  })

  await prisma.classStudentHistory.create({
    data: {
      description: justify_disabled,
      class_id: newClass.class_year.key,
      student_id,
    },
  })

  return newClass
}
