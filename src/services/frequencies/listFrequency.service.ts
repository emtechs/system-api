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
      select: { id: true },
      orderBy: { finished_at: 'desc' },
    }),
    prisma.frequency.count({ where }),
  ])

  return {
    total,
    result: await frequencyArrReturn(frequencies),
  }
}
