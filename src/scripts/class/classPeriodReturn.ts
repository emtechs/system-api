import { prisma } from '../../lib'

const classPeriod = async (
  classPeriod: {
    key: string
    class: {
      id: string
      name: string
    }
  },
  date_initial: Date,
  date_final: Date,
) => {
  const { key, class: classData } = classPeriod

  let infrequency = 0

  const [frequency, frequencies] = await Promise.all([
    prisma.frequency.aggregate({
      _avg: { infrequency: true },
      where: {
        is_open: false,
        date_time: { lte: date_final, gte: date_initial },
        class: { key },
      },
    }),
    prisma.frequency.count({
      where: {
        is_open: false,
        date_time: { lte: date_final, gte: date_initial },
        class: { key },
      },
    }),
  ])

  if (frequency._avg.infrequency) infrequency = frequency._avg.infrequency

  return { ...classData, infrequency, frequencies }
}

export const classArrayPeriodReturn = async (
  classes: {
    key: string
    class: {
      id: string
      name: string
    }
  }[],
  date_initial: Date,
  date_final: Date,
) => {
  const classesData = classes.map((el) =>
    classPeriod(el, date_initial, date_final),
  )

  return Promise.all(classesData).then((data) => {
    return data
  })
}
