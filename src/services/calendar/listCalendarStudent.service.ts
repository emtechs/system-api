import { ICalendarQuery, IStatusStudent } from '../../interfaces'
import { prisma } from '../../lib'

const statusFrequencyPtBr = (status: IStatusStudent) => {
  switch (status) {
    case 'PRESENTED':
      return 'Presente'

    case 'MISSED':
      return 'Faltou'

    case 'JUSTIFIED':
      return 'Justificou'
  }
}

const defineColor = (status: IStatusStudent) => {
  switch (status) {
    case 'PRESENTED':
      return '#388e3c'

    case 'MISSED':
      return '#d32f2f'

    case 'JUSTIFIED':
      return '#f57c00'
  }
}

export const listCalendarStudentService = async (
  student_id: string,
  { month }: ICalendarQuery,
) => {
  let whereData = {}
  let whereFrequency = {}

  if (month)
    whereFrequency = {
      ...whereFrequency,
      month: { name: { contains: month, mode: 'insensitive' } },
    }

  whereFrequency = {
    ...whereFrequency,
    is_open: false,
  }

  whereData = {
    ...whereData,
    student_id,
    frequency: { ...whereFrequency },
  }

  const frequenciesData = await prisma.frequencyStudent.findMany({
    where: { ...whereData },
    include: { frequency: true },
  })

  const frequencies = frequenciesData.length

  if (frequencies === 0) return []

  const calendar: {
    title: string
    date: string
    display: 'list-item'
    color: '#388e3c' | '#f57c00' | '#d32f2f'
  }[] = []

  const dates = [...new Set(frequenciesData.map((el) => el.frequency.date))]

  dates.forEach((date) => {
    let status: IStatusStudent = 'PRESENTED'

    frequenciesData.forEach((el) => {
      if (el.frequency.date === date) status = el.status
    })
    const dateData = date.split('/')

    calendar.push({
      title: statusFrequencyPtBr(status),
      date: `${dateData[2]}-${dateData[1]}-${dateData[0]}`,
      display: 'list-item',
      color: defineColor(status),
    })
  })

  return calendar
}
