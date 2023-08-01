import { IQuery } from '../../interfaces'
import { prisma } from '../../lib'
import { UserReturnSchema } from '../../schemas'
import { listPeriodService } from '../calendar'

export const profileUserService = async (id: string, { date }: IQuery) => {
  const [userData, years, periodsData] = await Promise.all([
    prisma.user.findUnique({
      where: { id },
    }),
    prisma.year.findMany({ orderBy: { year: 'desc' } }),
    listPeriodService({ date }),
  ])

  const periods = periodsData.result.map((el) => el)

  return { user: UserReturnSchema.parse(userData), years, periods }
}
