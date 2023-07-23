import { prisma } from '../../lib'
import { AppError } from '../../errors'

export const deleteUserService = async (login: string) => {
  try {
    await prisma.user.delete({
      where: { login },
    })
  } catch {
    throw new AppError('user not found', 404)
  }
}
