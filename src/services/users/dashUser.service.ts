import { prisma } from '../../lib'

export const dashUserService = async (year_id: string) => {
  const [
    countSchool,
    countClass,
    countStudent,
    countFrequency,
    countServer,
    countNotClass,
  ] = await Promise.all([
    prisma.school.count({ where: { is_active: true } }),
    prisma.classYear.count({ where: { year_id } }),
    prisma.student.count(),
    prisma.frequency.count({
      where: { year_id, is_open: false },
    }),
    prisma.user.count({
      where: {
        role: { not: { in: ['ADMIN', 'SECRET'] } },
        is_active: true,
      },
    }),
    prisma.student.count({ where: { classes: { none: { year_id } } } }),
  ])

  return {
    countSchool,
    countClass,
    countStudent,
    countFrequency,
    countServer,
    countNotClass,
  }
}
