import { AppError } from '../../http/error'
import { prisma } from '../../lib'

export const verifyUser = async (id: string) => {
  const user_id = id

  const [user, yearsData] = await Promise.all([
    prisma.user.findUnique({
      where: { id },
      select: { name: true },
    }),
    prisma.period.findMany({
      where: { frequencies: { some: { frequency: { user_id } } } },
      select: { year: { select: { id: true, year: true } } },
      distinct: ['year_id'],
      orderBy: { year: { year: 'desc' } },
    }),
  ])

  if (!user) throw new AppError('user not found', 404)

  const years = yearsData.map((el) => {
    return { id: el.year.id, year: el.year.year }
  })

  const select = { id, label: user.name }

  return { select, years }
}
