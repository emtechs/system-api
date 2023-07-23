import { IUserReturn } from '../interfaces'
import { prisma } from '../lib'

export const userReturn = async (user: IUserReturn, school_id = '') => {
  if (school_id.length > 0) {
    const work_school = await prisma.schoolServer.findUnique({
      where: { school_id_server_id: { school_id, server_id: user.id } },
      select: {
        dash: true,
        role: true,
        school: { select: { id: true, name: true } },
      },
    })

    if (work_school) return { ...user, work_school }
  }

  return user
}

export const userReturnArray = async (
  usersData: IUserReturn[],
  school_id = '',
) => {
  const users = usersData.map((el) => userReturn(el, school_id))

  return Promise.all(users).then((school) => {
    return school
  })
}
