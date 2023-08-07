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
      where: { school_id, is_open: true },
    }),
    prisma.classStudent.count({
      where: { school_id, year_id },
    }),
    prisma.classYear.count({
      where: { school_id, year_id },
    }),
  ])

  dashSchool = { ...dashSchool, frequencyOpen, stundents, classTotal }

  if (!date) return dashSchool

  let day_infreq = 0
  let school_infreq = 0

  const [frequencyDayData, frequencyData, frequencies] = await Promise.all([
    prisma.frequency.aggregate({
      _avg: { infrequency: true },
      where: {
        is_open: false,
        date,
        school_id,
      },
    }),
    prisma.frequency.aggregate({
      _avg: { infrequency: true },
      where: {
        is_open: false,
        year_id,
        school_id,
      },
    }),
    prisma.frequency.count({
      where: {
        is_open: false,
        date,
        school_id,
      },
    }),
  ])

  if (frequencyDayData._avg.infrequency)
    day_infreq = frequencyDayData._avg.infrequency

  if (frequencyData._avg.infrequency)
    school_infreq = frequencyData._avg.infrequency

  dashSchool = { ...dashSchool, frequencies, day_infreq, school_infreq }

  return dashSchool
}
