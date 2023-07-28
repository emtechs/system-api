import { ISchoolQuery } from '../../interfaces'
import { prisma } from '../../lib'

export const listSchoolServerService = async ({
  name,
  user_id,
}: ISchoolQuery) => {
  const [schoolsData, total] = await Promise.all([
    prisma.schoolServer.findMany({
      where: {
        server_id: user_id,
        school: { name: { contains: name, mode: 'insensitive' } },
      },
      include: { school: { select: { id: true, name: true } } },
      orderBy: { school: { name: 'asc' } },
    }),
    prisma.schoolServer.count({
      where: {
        server_id: user_id,
        school: { name: { contains: name, mode: 'insensitive' } },
      },
    }),
  ])

  const result = schoolsData.map((el) => {
    const { dash, key, role, school } = el
    const { id, name } = school

    return { id, name, dash, key, role }
  })

  return {
    total,
    result,
  }
}
