import { AppError } from '../../errors'
import { prisma } from '../../lib'

export const verifyUser = async (id: string) => {
  const [user, years] = await Promise.all([
    prisma.user.findUnique({
      where: { id },
      select: { name: true },
    }),
    prisma.year.findMany({
      orderBy: { year: 'desc' },
    }),
  ])

  if (!user) throw new AppError('user not found', 404)

  const select = { id, label: user.name }

  return { select, years }
}
