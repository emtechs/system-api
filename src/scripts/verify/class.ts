import { AppError } from '../../errors'
import { prisma } from '../../lib'

export const verifyClass = async (id: string) => {
  const class_id = id

  const [classData, years] = await Promise.all([
    prisma.class.findUnique({
      where: { id },
      select: { name: true },
    }),
    prisma.year.findMany({
      where: { classes: { some: { class_id } } },
      orderBy: { year: 'desc' },
    }),
  ])

  if (!classData) throw new AppError('class not found', 404)

  const select = { id, label: classData.name }

  return { select, years }
}
