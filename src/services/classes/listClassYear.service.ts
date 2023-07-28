import { IClassQuery } from '../../interfaces'
import { prisma } from '../../lib'

export const listClassYearService = async ({
  name,
  school_id,
  year_id,
  take,
  skip,
}: IClassQuery) => {
  if (take) take = +take
  if (skip) skip = +skip

  const [data, total, dataLabel] = await Promise.all([
    prisma.classYear.findMany({
      take,
      skip,
      where: {
        school_id,
        year_id,
        class: { name: { contains: name, mode: 'insensitive' } },
      },
      select: {
        _count: {
          select: {
            students: true,
            frequencies: { where: { status: 'CLOSED' } },
          },
        },
        class: { select: { id: true, name: true } },
        school: { select: { id: true, name: true } },
        year_id: true,
        key: true,
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
    prisma.classYear.findMany({
      where: {
        school_id,
        year_id,
      },
      select: {
        class: { select: { id: true, name: true } },
        year_id: true,
        key: true,
      },
      orderBy: { class: { name: 'asc' } },
    }),
  ])

  const result = data.map((el) => {
    const { _count, class: class_data, key, school, year_id: year_data } = el
    const { id, name } = class_data
    return {
      id,
      name,
      students: _count.students,
      frequencies: _count.frequencies,
      key,
      school,
      year_id: year_data,
    }
  })

  const classes = dataLabel.map((el) => {
    const { class: class_data, key, year_id: year_data } = el
    const { id, name } = class_data
    return {
      id,
      name,
      label: name,
      key,
      year_id: year_data,
    }
  })

  return { total, result, classes }
}
