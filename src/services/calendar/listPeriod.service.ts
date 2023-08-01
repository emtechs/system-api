import { CategoryPeriod } from '@prisma/client'
import { ICalendarQuery } from '../../interfaces'
import { prisma } from '../../lib'
import { PeriodReturnSchema } from '../../schemas'

export const listPeriodService = async ({
  key_class,
  school_id,
  year_id,
  category,
  name,
}: ICalendarQuery) => {
  const [periods, total] = await Promise.all([
    prisma.period.findMany({
      where: {
        name: { contains: name, mode: 'insensitive' },
        category,
        year_id,
      },
      include: { year: true },
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    }),
    prisma.period.count({
      where: {
        name: { contains: name, mode: 'insensitive' },
        category,
        year_id,
      },
    }),
  ])

  if (key_class) {
    const result = await verifyArrayReturn(periods, key_class)
    return { total: result.length, result: PeriodReturnSchema.parse(result) }
  }

  if (school_id && year_id) {
    const result = await verifyArrayReturn(
      periods,
      undefined,
      school_id,
      year_id,
    )
    return { total: result.length, result: PeriodReturnSchema.parse(result) }
  }

  return { total, result: PeriodReturnSchema.parse(periods) }
}

type IPeriod = {
  id: string
  name: string
  category: CategoryPeriod
  date_initial: Date
  date_final: Date
  year_id: string
  year: {
    id: string
    year: string
  }
}

const verifyReturn = async (
  period: IPeriod,
  key_class: string | undefined,
  school_id: string | undefined,
  year_id: string | undefined,
) => {
  let where = {}

  if (key_class) where = { ...where, class: { key: key_class } }
  if (school_id) where = { ...where, school_id }
  if (year_id) where = { ...where, year_id }

  const { date_initial, date_final } = period

  where = {
    ...where,
    status: 'CLOSED',
    date_time: { lte: date_final, gte: date_initial },
  }

  const frequency = await prisma.frequency.findMany({
    where,
  })

  if (frequency.length) return period
}

const verifyArrayReturn = async (
  periods: IPeriod[],
  key_class = '',
  school_id = '',
  year_id = '',
) => {
  const periodsData = periods.map((el) =>
    verifyReturn(el, key_class, school_id, year_id),
  )

  return Promise.all(periodsData).then((periodData) => {
    const data: IPeriod[] = []
    periodData.forEach((el) => {
      if (el) data.push(el)
    })
    return data
  })
}
