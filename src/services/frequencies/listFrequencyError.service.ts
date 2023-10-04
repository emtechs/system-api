import sortArray from 'sort-array'
import { prisma } from '../../lib'
import { env } from '../../env'

export const listFrequencyErrorService = async () => {
  const frequenciesData = await prisma.frequency.groupBy({
    by: ['school_id', 'class_id', 'year_id', 'date', 'date_time'],
    _count: { _all: true },
    orderBy: { _count: { id: 'desc' } },
  })

  const frequencies = frequenciesData.filter((el) => el._count._all > 1)

  const result = await frequencyArrayError(frequencies)

  return {
    total: frequencies.length,
    result: sortArray(result, {
      by: 'date_time',
      order: 'asc',
    }),
  }
}

const frequencyArrayError = async (
  frequencies: {
    _count: {
      _all: number
    }
    school_id: string
    class_id: string
    year_id: string
    date: string
    date_time: Date
  }[],
) => {
  const frequencyData = frequencies.map((el) => frequencyError(el))

  return Promise.all(frequencyData).then((freq) => {
    return freq
  })
}

const frequencyError = async (frequency: {
  _count: {
    _all: number
  }
  school_id: string
  class_id: string
  year_id: string
  date: string
  date_time: Date
}) => {
  const { class_id, date, school_id, year_id, _count, date_time } = frequency

  const [schoolData, classData, yearData] = await Promise.all([
    prisma.school.findUnique({
      where: { id: school_id },
      select: { id: true, name: true },
    }),
    prisma.class.findUnique({
      where: { id: class_id },
      select: { id: true, name: true },
    }),
    prisma.year.findUnique({
      where: { id: year_id },
      select: { id: true, year: true },
    }),
  ])

  return {
    ...schoolData,
    class: classData,
    year: yearData,
    date,
    date_time,
    _count: _count._all,
    link: `${env.BASE_URL}/${schoolData?.id}/frequency?year_id=day&date=${date}`,
  }
}
