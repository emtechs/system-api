import { prisma } from '../../lib'
import { UserReturnSchema } from '../../schemas'

export const profileUserService = async (id: string) => {
  const [userData, years] = await Promise.all([
    prisma.user.findUnique({
      where: { id },
    }),
    prisma.year.findMany({ orderBy: { year: 'desc' } }),
  ])

  return { user: UserReturnSchema.parse(userData), years }
}
