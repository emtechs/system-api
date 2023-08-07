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
  date,
}: ICalendarQuery) => {
  let whereDate = {}

  if (date) {
    const dateData = date.split('/')
    const date_time = new Date(`${dateData[2]}-${dateData[1]}-${dateData[0]}`)
    whereDate = {
      date_initial: { lte: date_time },
      date_final: { gte: date_time },
    }
  }

  const [periods, total] = await Promise.all([
    prisma.period.findMany({
      where: {
        name: { contains: name, mode: 'insensitive' },
        category,
        year_id,
        ...whereDate,
      },
      include: { year: true },
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    }),
    prisma.period.count({
      where: {
        name: { contains: name, mode: 'insensitive' },
        category,
        year_id,
        ...whereDate,
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
  key_class?: string,
  school_id?: string,
  year_id?: string,
) => {
  let where = {}

  if (key_class) where = { ...where, class: { key: key_class } }
  if (school_id) where = { ...where, school_id }
  if (year_id) where = { ...where, year_id }

  const { date_initial, date_final } = period

  where = {
    ...where,
    is_open: false,
    date_time: { lte: date_final, gte: date_initial },
  }

  const frequency = await prisma.frequency.findMany({
    where,
  })

  if (frequency.length) return period
}

const verifyArrayReturn = async (
  periods: IPeriod[],
  key_class?: string,
  school_id?: string,
  year_id?: string,
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
