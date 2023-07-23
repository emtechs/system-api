import { IFrequencyQuery } from '../../interfaces'
import { prisma } from '../../lib'
import { frequencyHistoryArrayReturn } from '../../scripts'

export const listFrequencyHistoryService = async ({
  take,
  skip,
  school_id,
  year_id,
  user_id,
  name,
}: IFrequencyQuery) => {
  if (take) take = +take
  if (skip) skip = +skip

  const [frequencies, total] = await Promise.all([
    prisma.frequencyHistory.findMany({
      take,
      skip,
      where: {
        user_id,
        frequency: {
          frequency: { year_id, school_id },
          student: { name: { contains: name, mode: 'insensitive' } },
        },
      },
    }),
    prisma.frequencyHistory.count({
      where: { frequency: { frequency: { year_id, school_id } } },
    }),
  ])

  return { result: await frequencyHistoryArrayReturn(frequencies), total }
}
