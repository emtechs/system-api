import { prisma } from '../../lib'

export const retrieveYearService = async (year: string) => {
  const schoolYear = await prisma.year.findUnique({ where: { year } })

  return schoolYear
}
