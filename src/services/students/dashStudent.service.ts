import { ICalendarQuery } from '../../interfaces'
import { prisma } from '../../lib'

export const dashStudentService = async (
  student_id: string,
  _year_id: string,
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
    is_open: false,
  }

  const frequencies = await prisma.frequency.count({
    where: { ...whereData },
  })

  return frequencies
}
