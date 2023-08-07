import { ICalendarQuery } from '../../interfaces'
import { prisma } from '../../lib'

export const dashClassService = async (
  class_id: string,
  school_id: string,
  year_id: string,
  { month }: ICalendarQuery,
) => {
  let whereData = {}

  if (month)
    whereData = {
      ...whereData,
      month: { name: { contains: month, mode: 'insensitive' } },
    }

  whereData = {
    ...whereData,
    is_open: false,
    year_id,
    class_id,
    school_id,
  }

  const [frequencies, frequencyOpen, stundents] = await Promise.all([
    prisma.frequency.count({
      where: {
        ...whereData,
      },
    }),

    prisma.frequency.count({
      where: { school_id, class_id, year_id, is_open: true },
    }),
    prisma.classStudent.count({
      where: { school_id, year_id, class_id },
    }),
  ])

  return { frequencies, class_infreq: 0, frequencyOpen, stundents }
}
