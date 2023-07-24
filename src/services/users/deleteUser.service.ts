import { prisma } from '../../lib'
import { AppError } from '../../http/error'

export const deleteUserService = async (login: string) => {
  try {
    await prisma.user.delete({
      where: { login },
    })
  } catch {
    throw new AppError('user not found', 404)
  }
}
