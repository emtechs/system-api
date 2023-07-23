import { ISchoolQuery } from '../../interfaces'
import { prisma } from '../../lib'

export const dashSchoolService = async (
  school_id: string,
  year_id: string,
  { date }: ISchoolQuery,
) => {
  let dashSchool = {}

  const [frequencyOpen, stundents, classTotal] = await Promise.all([
    prisma.frequency.count({
      where: { school_id, status: 'OPENED' },
    }),
    prisma.classStudent.count({
      where: { school_id, year_id, is_active: true },
    }),
    prisma.classYear.count({
      where: { school_id, year_id },
    }),
  ])

  dashSchool = { ...dashSchool, frequencyOpen, stundents, classTotal }

  if (!date) return dashSchool

  const dateData = date.split('/')
  const date_time = new Date(`${dateData[2]}-${dateData[1]}-${dateData[0]}`)

  let day_infreq = 0
  let school_infreq = 0

  const [frequenciesData, period_ano] = await Promise.all([
    prisma.frequency.findMany({
      where: {
        status: 'CLOSED',
        date,
        school_id,
      },
      select: { infrequency: true },
    }),
    prisma.schoolInfrequency.findFirst({
      where: {
        school_id,
        period: {
          category: 'ANO',
          date_initial: { lte: date_time },
          date_final: { gte: date_time },
          year_id,
        },
      },
      select: { value: true },
    }),
  ])

  if (period_ano) school_infreq = period_ano.value

  frequenciesData.forEach((el) => {
    day_infreq += el.infrequency
  })

  const frequencies = frequenciesData.length

  dashSchool = { ...dashSchool, frequencies, school_infreq }

  if (frequencies === 0) return dashSchool

  day_infreq = day_infreq / frequencies

  dashSchool = { ...dashSchool, day_infreq }

  return dashSchool
}
