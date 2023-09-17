import { IQuery } from '../../interfaces'
import { prisma } from '../../lib'
import { UserReturnSchema } from '../../schemas'

export const retrieveUserService = async (
  id: string,
  { school_id }: IQuery,
) => {
  let user = {}

  const userData = await prisma.user.findUnique({
    where: { id },
    include: { profile: { select: { url: true } } },
  })

  user = { ...user, ...userData }

  if (school_id) {
    const [work_school, frequencies] = await Promise.all([
      prisma.schoolServer.findUnique({
        where: { school_id_server_id: { school_id, server_id: id } },
        select: {
          dash: true,
          role: true,
          school: { select: { id: true, name: true } },
        },
      }),
      prisma.frequency.count({
        where: { school_id, user_id: id },
      }),
    ])

    user = { ...user, frequencies }

    if (work_school) user = { ...user, work_school }
  }

  return UserReturnSchema.parse(user)
}
