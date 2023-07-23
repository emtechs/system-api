import { IClassQuery } from '../../interfaces'
import { prisma } from '../../lib'

export const listClassDashService = async (
  school_id: string,
  year_id: string,
  { date, take, skip, order, by }: IClassQuery,
) => {
  if (take) take = +take
  if (skip) skip = +skip

  let whereData = {}
  let whereInfrequencies = {}
  let orderBy = {}

  if (date) {
    const dateData = date.split('/')
    const date_time = new Date(`${dateData[2]}-${dateData[1]}-${dateData[0]}`)
    whereInfrequencies = {
      period: {
        category: 'ANO',
        date_initial: { lte: date_time },
        date_final: { gte: date_time },
        year_id,
      },
    }
  }

  if (order) {
    switch (order) {
      case 'name':
        orderBy = { class: { name: by } }
        break

      case 'infreq':
        orderBy = { infrequency: by }
        break
    }
  }

  whereData = {
    ...whereData,
    class: { is_active: true },
    frequencies: { none: { date, status: 'CLOSED' } },
    school_id,
  }

  const [classesData, total, classesLabel] = await Promise.all([
    prisma.classYear.findMany({
      take,
      skip,
      where: {
        ...whereData,
      },
      orderBy,
      select: {
        class: { select: { id: true, name: true } },
        students: { select: { student_id: true } },
        infrequencies: {
          where: { ...whereInfrequencies },
          select: { value: true },
        },
        school_id: true,
        year_id: true,
        _count: { select: { students: true, frequencies: true } },
      },
    }),
    prisma.classYear.count({
      where: {
        ...whereData,
      },
    }),
    prisma.classYear.findMany({
      where: {
        ...whereData,
      },
      orderBy: { class: { name: 'asc' } },
      select: {
        class: { select: { id: true, name: true } },
        students: { select: { student_id: true } },
        infrequencies: {
          where: { ...whereInfrequencies },
          select: { value: true },
        },
        school_id: true,
        year_id: true,
        _count: { select: { students: true, frequencies: true } },
      },
    }),
  ])

  const classes = classesLabel.map((el) => {
    return {
      id: el.class.id,
      label: el.class.name,
      infrequency: el.infrequencies.length > 0 ? el.infrequencies[0].value : 0,
      ...el,
    }
  })

  const result = classesData.map((el) => {
    return {
      id: el.class.id,
      label: el.class.name,
      infrequency: el.infrequencies.length > 0 ? el.infrequencies[0].value : 0,
      ...el,
    }
  })

  return {
    classes,
    total,
    result,
  }
}
