import { prisma } from '../../../lib'

export const viewClass = async (school_id: string, year_id = '', name = '') => {
  const [data, total] = await Promise.all([
    prisma.classYear.findMany({
      where: {
        school_id,
        year_id,
        class: { name: { contains: name, mode: 'insensitive' } },
      },
      select: {
        _count: {
          select: {
            students: true,
            frequencies: { where: { is_open: false } },
          },
        },
        key: true,
        class: { select: { id: true, name: true } },
      },
      orderBy: { class: { name: 'asc' } },
    }),
    prisma.classYear.count({
      where: {
        school_id,
        year_id,
        class: { name: { contains: name, mode: 'insensitive' } },
      },
    }),
  ])

  const result = data.map((el) => {
    const { _count, class: class_data, key } = el
    const { id, name } = class_data
    return {
      id,
      name,
      students: _count.students,
      frequencies: _count.frequencies,
      key,
    }
  })

  return { total, result }
}
