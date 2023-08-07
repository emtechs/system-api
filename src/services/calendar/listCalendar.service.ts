import { ICalendarQuery } from '../../interfaces'
import { prisma } from '../../lib'

const defineColor = (infreq: number) => {
  if (infreq <= 30) return '#388e3c'

  if (infreq <= 65) return '#f57c00'

  return '#d32f2f'
}

export const listCalendarService = async (
  year_id: string,
  { month, school_id }: ICalendarQuery,
) => {
  let whereData = {}
  let classTotal = 0

  if (month)
    whereData = {
      ...whereData,
      month: { name: { contains: month, mode: 'insensitive' } },
    }

  if (school_id) {
    whereData = { ...whereData, school_id }
    classTotal = await prisma.classYear.count({
      where: { school_id, year_id },
    })
  }

  whereData = { ...whereData, is_open: false, year_id }

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
    classNames: string[]
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
      classNames: classTotal === count ? ['allFrequency'] : [],
    })
    calendar.push({
      title: school_id ? `${count}/${classTotal}` : `${count}`,
      date: `${dateData[2]}-${dateData[1]}-${dateData[0]}`,
      display: 'list-item',
      color: '#0288d1',
      classNames: classTotal === count ? ['allFrequency'] : [],
    })
  })

  return calendar
}
