import { IQuery } from '../../interfaces'
import { prisma } from '../../lib'
import { UserReturnSchema } from '../../schemas'
import { listPeriodService } from '../calendar'

export const pageUserService = async (id: string, { date }: IQuery) => {
  const [userData, periodsData] = await Promise.all([
    prisma.user.findUnique({
      where: { id },
    }),
    listPeriodService({ date }),
  ])

  const periods = periodsData.result.map((el) => el)

  return { user: UserReturnSchema.parse(userData), periods }
}
