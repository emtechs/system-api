import { prisma } from '../../lib'

export const listPeriodService = async () => {
  const periods = await prisma.period.findMany()

  return periods
}
