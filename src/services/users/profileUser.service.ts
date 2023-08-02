import { prisma } from '../../lib'

export const profileUserService = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      dash: true,
      role: true,
      is_first_access: true,
    },
  })

  return user
}
