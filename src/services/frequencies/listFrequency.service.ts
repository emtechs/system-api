import { IFrequencyQuery } from '../../interfaces'
import { prisma } from '../../lib'
import { frequencyArrReturn } from '../../scripts'

export const listFrequencyService = async ({
  take,
  skip,
  date,
  class_id,
  school_id,
  year_id,
  user_id,
  is_active,
  name,
  month_id,
}: IFrequencyQuery) => {
  if (take) take = +take
  if (skip) skip = +skip

  let where = {}

  if (name)
    where = {
      ...where,
      OR: [
        {
          class: { class: { name: { contains: name, mode: 'insensitive' } } },
        },
        {
          class: {
            school: { name: { contains: name, mode: 'insensitive' } },
          },
        },
        { user: { name: { contains: name, mode: 'insensitive' } } },
      ],
    }

  if (is_active) {
    switch (is_active) {
      case 'true':
        where = { ...where, is_open: false }
        break

      case 'false':
        where = { ...where, is_open: true }
        break
    }
  }

  if (date) where = { ...where, date }
  if (class_id) where = { ...where, class_id }
  if (school_id) where = { ...where, school_id }
  if (year_id) where = { ...where, year_id }
  if (user_id) where = { ...where, user_id }
  if (month_id) where = { ...where, month_id }

  where = { ...where, request_id: { equals: null } }

  const [frequencies, total, monthsData] = await Promise.all([
    prisma.frequency.findMany({
      take,
      skip,
      where,
      select: { id: true },
      orderBy: [{ finished_at: 'desc' }, { date_time: 'desc' }],
    }),
    prisma.frequency.count({ where }),
    prisma.frequency.findMany({
      where: { year_id, request_id: { equals: null } },
      distinct: ['month_id'],
      select: { month: true },
      orderBy: { month: { month: 'asc' } },
    }),
  ])

  const months = monthsData.map((el) => el.month)

  return {
    total,
    result: await frequencyArrReturn(frequencies),
    months,
  }
}
