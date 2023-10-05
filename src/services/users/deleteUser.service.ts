import { prisma } from '../../lib'
import { AppError } from '../../errors'
import { deleteImageKey } from '../../scripts'

export const deleteUserService = async (login: string) => {
  try {
    const user = await prisma.user.delete({
      where: { login },
      select: { profile: { select: { key: true } } },
    })

    if (user.profile?.key) await deleteImageKey(user.profile.key)
  } catch {
    throw new AppError('user not found', 404)
  }
}
