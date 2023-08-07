import { ICalendarQuery } from '../../interfaces'
import { prisma } from '../../lib'

const defineColor = (infreq: number) => {
  if (infreq <= 30) return '#388e3c'

  if (infreq <= 65) return '#f57c00'

  return '#d32f2f'
}

export const listCalendarFrequencyService = async (
  year_id: string,
  school_id: string,
  class_id: string,
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

  const frequenciesData = await prisma.frequency.findMany({
    where: {
      ...whereData,
    },
  })

  const frequencies = frequenciesData.length

  if (frequencies === 0) return []

  const calendar: {
    title: string
    date: string
    display: 'list-item'
    color: '#388e3c' | '#f57c00' | '#d32f2f' | '#0288d1'
  }[] = []

  const dates = [...new Set(frequenciesData.map((el) => el.date))]

  dates.forEach((date) => {
    let infrequency = 0
    let count = 0
    frequenciesData.forEach((el) => {
      if (el.date === date) {
        infrequency += el.infrequency
        count++
      }
    })
    const dateData = date.split('/')
    const infreq = infrequency / count
    calendar.push({
      title: infreq.toFixed(0) + '%',
      date: `${dateData[2]}-${dateData[1]}-${dateData[0]}`,
      display: 'list-item',
      color: defineColor(infreq),
    })
  })

  return calendar
}
