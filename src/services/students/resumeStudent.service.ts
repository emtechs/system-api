import { IQuery } from '../../interfaces'
import { prisma } from '../../lib'

export const resumeStudentService = async ({
  school_id,
  year_id,
  take,
  skip,
}: IQuery) => {
  const [students, total] = await Promise.all([
    prisma.abstract.findMany({
      take,
      skip,
      where: {
        school_id,
        year_id,
      },
      orderBy: { absences: 'desc' },
    }),
    prisma.abstract.count({
      where: {
        school_id,
        year_id,
      },
    }),
  ])
  return {
    total,
    result: students,
  }
}
