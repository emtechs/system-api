import { prisma } from '../../../lib'

export const viewServer = async (school_id: string, name = '') => {
  const [data, total] = await Promise.all([
    prisma.schoolServer.findMany({
      where: {
        school_id,
        server: { name: { contains: name, mode: 'insensitive' } },
      },
      select: {
        dash: true,
        role: true,
        key: true,
        server: { select: { id: true, name: true, cpf: true } },
      },
      orderBy: { server: { name: 'asc' } },
    }),
    prisma.schoolServer.count({
      where: {
        school_id,
        server: { name: { contains: name, mode: 'insensitive' } },
      },
    }),
  ])

  const result = data.map((el) => {
    const { dash, key, role, server } = el
    const { cpf, id, name } = server

    return { id, name, cpf, dash, role, key }
  })

  return { total, result }
}
