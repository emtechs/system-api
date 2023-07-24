import { prisma } from '../../lib'
import { AppError } from '../../http/error'

export const deleteSchoolService = async (id: string) => {
  try {
    await prisma.school.delete({
      where: { id },
    })
  } catch {
    throw new AppError('school not found', 404)
  }
}
