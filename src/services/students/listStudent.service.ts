import { IStudentQuery } from '../../interfaces'
import { prisma } from '../../lib'

export const listStudentService = async ({
  take,
  skip,
  name,
}: IStudentQuery) => {
  if (take) take = +take
  if (skip) skip = +skip

  let where = {}

  if (name)
    where = {
      OR: [
        { name: { contains: name, mode: 'insensitive' } },
        { registry: { contains: name, mode: 'insensitive' } },
      ],
    }

  const [students, total] = await Promise.all([
    prisma.student.findMany({
      take,
      skip,
      where,
      orderBy: { name: 'asc' },
    }),
    prisma.student.count({ where }),
  ])

  return {
    total,
    result: students,
  }
}
