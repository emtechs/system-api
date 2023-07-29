import { IClassQuery } from '../../interfaces'
import { prisma } from '../../lib'

export const listClassDashService = async (
  school_id: string,
  year_id: string,
  { date, take, skip }: IClassQuery,
) => {
  if (take) take = +take
  if (skip) skip = +skip

  let where = {}

  where = {
    ...where,
    class: { is_active: true },
    frequencies: { none: { date, status: 'CLOSED' } },
    school_id,
    year_id,
  }

  const [classesData, total, classesLabel] = await Promise.all([
    prisma.classYear.findMany({
      take,
      skip,
      where,
      orderBy: { class: { name: 'asc' } },
      select: {
        key: true,
      },
    }),
    prisma.classYear.count({
      where,
    }),
    prisma.classYear.findMany({
      take,
      skip,
      where,
      orderBy: { class: { name: 'asc' } },
      select: {
        key: true,
      },
    }),
  ])

  return {
    classes: await classArrayReturn(classesLabel),
    total,
    result: await classArrayReturn(classesData),
  }
}

const classArrayReturn = async (
  classes: {
    key: string
  }[],
) => {
  const classesData = classes.map((el) => returnClass(el.key))

  return Promise.all(classesData).then((school) => {
    return school
  })
}

const returnClass = async (key: string) => {
  let infrequency = 0

  const [classData, frequencyData] = await Promise.all([
    prisma.classYear.findUnique({
      where: { key },
      select: {
        class: { select: { id: true, name: true } },
        students: { select: { student_id: true } },
        school_id: true,
        year_id: true,
        _count: {
          select: {
            students: true,
            frequencies: { where: { status: 'CLOSED' } },
          },
        },
      },
    }),
    prisma.frequency.aggregate({
      _avg: { infrequency: true },
      where: { class: { key }, status: 'CLOSED' },
    }),
  ])
  if (frequencyData._avg.infrequency)
    infrequency = frequencyData._avg.infrequency

  return {
    id: classData?.class.id,
    label: classData?.class.id,
    infrequency,
    ...classData,
  }
}
