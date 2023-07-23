import { prisma } from '../../lib'

export const retrieveStudentService = async (id: string) => {
  return await prisma.student.findUnique({ where: { id } })
}
