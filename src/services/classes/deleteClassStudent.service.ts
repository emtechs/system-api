import { prisma } from '../../lib'

export const deleteClassStudentService = async (key: string) => {
  await prisma.classStudent.delete({
    where: { key },
  })
}
