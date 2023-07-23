import { IQuery } from '../../interfaces'
import { prisma } from '../../lib'
import { UserReturnSchema } from '../../schemas'
import { userReturn } from '../../scripts'

export const retrieveUserService = async (
  id: string,
  { school_id }: IQuery,
) => {
  let where_frequency = {}
  let user = {}

  if (school_id) where_frequency = { ...where_frequency, school_id }

  where_frequency = { ...where_frequency, user_id: id }

  const [userData, frequencies] = await Promise.all([
    prisma.user.findUnique({
      where: { id },
    }),
    prisma.frequency.count({
      where: where_frequency,
    }),
  ])

  user = { ...user, ...userData, frequencies }

  return UserReturnSchema.parse(await userReturn(user, school_id))
}
