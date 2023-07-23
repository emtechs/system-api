import { ICalendarQuery } from '../../interfaces'
import { prisma } from '../../lib'

export const dashStudentService = async (
  student_id: string,
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
    students: { every: { student_id } },
    status: 'CLOSED',
  }

  const [frequencies, { value: stundent_infreq }] = await Promise.all([
    prisma.frequency.count({
      where: { ...whereData },
    }),
    prisma.studentInfrequency.findUnique({
      where: { year_id_student_id: { student_id, year_id } },
      select: { value: true },
    }),
  ])

  return { frequencies, stundent_infreq }
}
