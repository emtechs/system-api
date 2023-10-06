import { IRequestUser } from '../../interfaces'
import { prisma } from '../../lib'

export const profileUserService = async ({ id, role }: IRequestUser) => {
  let requests = 0

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      dash: true,
      role: true,
      is_super: true,
      is_first_access: true,
      profile: { select: { url: true } },
    },
  })

  if (role === 'ADMIN') requests = await prisma.request.count()

  return { ...user, requests }
}
