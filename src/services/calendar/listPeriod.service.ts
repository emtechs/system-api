import { ICalendarQuery } from '../../interfaces'
import { prisma } from '../../lib'
import { PeriodReturnSchema } from '../../schemas'

export const listPeriodService = async ({
  key_class,
  school_id,
  year_id,
  category,
}: ICalendarQuery) => {
  let where = {}

  if (key_class)
    where = {
      frequencies: {
        some: { frequency: { status: 'CLOSED', class: { key: key_class } } },
      },
    }

  if (school_id)
    where = {
      frequencies: {
        some: { frequency: { status: 'CLOSED', school_id, year_id } },
      },
    }

  const periods = await prisma.period.findMany({
    where: { category, year_id, ...where },
    orderBy: [{ category: 'asc' }, { name: 'asc' }],
  })

  return PeriodReturnSchema.parse(periods)
}
