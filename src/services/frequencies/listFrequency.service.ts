import { IFrequencyQuery } from '../../interfaces'
import { prisma } from '../../lib'
import { frequencyReturn } from '../../scripts'

export const listFrequencyService = async ({
  take,
  skip,
  date,
  class_id,
  school_id,
  year_id,
  order,
  by,
  user_id,
  is_active,
}: IFrequencyQuery) => {
  if (take) take = +take
  if (skip) skip = +skip

  let where = {}
  let orderBy = {}

  if (order) {
    switch (order) {
      case 'created_at':
        orderBy = { created_at: by }
        break

      case 'date':
        orderBy = [{ date_time: by }, { class: { class: { name: 'asc' } } }]
        break

      case 'finished_at':
        orderBy = { finished_at: by }
        break

      case 'infreq':
        orderBy = { infrequency: by }
        break

      case 'name':
        orderBy = [{ class: { class: { name: by } } }, { date_time: 'asc' }]
        break
    }
  }

  if (is_active) {
    switch (is_active) {
      case 'true':
        where = { ...where, status: 'CLOSED' }
        break

      case 'false':
        where = { ...where, status: 'OPENED' }
        break
    }
  }

  if (date) where = { ...where, date }
  if (class_id) where = { ...where, class_id }
  if (school_id) where = { ...where, school_id }
  if (year_id) where = { ...where, year_id }
  if (user_id) where = { ...where, user_id }

  const [frequencies, total] = await Promise.all([
    prisma.frequency.findMany({
      take,
      skip,
      where,
      select: {
        id: true,
        date: true,
        status: true,
        infrequency: true,
        class: {
          select: {
            class: { select: { id: true, name: true } },
            school: { select: { id: true, name: true } },
          },
        },
        _count: { select: { students: true } },
      },
      orderBy,
    }),
    prisma.frequency.count({
      where,
    }),
  ])

  return {
    total,
    result: frequencyReturn(frequencies),
  }
}
