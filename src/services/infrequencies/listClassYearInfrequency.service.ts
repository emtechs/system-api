import { IFrequencyQuery } from '../../interfaces'
import { prisma } from '../../lib'

export const listClassYearInfrequencyService = async ({
  key_class,
  take,
  skip,
}: IFrequencyQuery) => {
  if (take) take = +take
  if (skip) skip = +skip

  const [data, total, dataPeriods] = await Promise.all([
    prisma.classYearInfrequency.findMany({
      take,
      skip,
      where: { class_year: { key: key_class } },
    }),
    prisma.classYearInfrequency.count({
      where: { class_year: { key: key_class } },
    }),
    prisma.classYearInfrequency.findMany({
      where: { class_year: { key: key_class } },
      select: {
        key: true,
        period: { select: { id: true, name: true } },
      },
      orderBy: { period: { name: 'asc' } },
    }),
  ])

  const periods = dataPeriods.map((el) => {
    const { key, period } = el
    const { id, name } = period
    return { id, name, label: name, key }
  })

  return { result: data, total, periods }
}
