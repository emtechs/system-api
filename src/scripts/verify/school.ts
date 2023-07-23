import { AppError } from '../../errors'
import { prisma } from '../../lib'

export const verifySchool = async (id: string) => {
  const school_id = id

  const [school, years] = await Promise.all([
    prisma.school.findUnique({
      where: { id },
      select: { name: true },
    }),
    prisma.year.findMany({
      where: { classes: { some: { school_id } } },
      orderBy: { year: 'desc' },
    }),
  ])

  if (!school) throw new AppError('school not found', 404)

  const select = { id, label: school.name }

  return { select, years }
}
