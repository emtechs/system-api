import { prisma } from '../../lib'
import { IYearRequest } from '../../interfaces'

export const createYearService = async ({ year }: IYearRequest) => {
  const yearData = await prisma.year.create({
    data: {
      year,
    },
  })

  return yearData
}
