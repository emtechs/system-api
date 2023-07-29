import { prisma } from '../../lib'

export const schoolReturn = async (
  id: string,
  year_id = '',
  server_id = '',
  class_id = '',
) => {
  const school_id = id

  let schoolData = {}
  let infrequency = 0
  let where = {}

  if (year_id) where = { ...where, year_id }
  if (class_id) where = { ...where, class_id }

  where = { ...where, school_id }

  const [
    school,
    classes,
    students,
    servers,
    serverData,
    frequencyData,
    frequencies,
  ] = await Promise.all([
    prisma.school.findUnique({
      where: { id },
      include: { director: { select: { id: true, name: true, cpf: true } } },
    }),
    prisma.classYear.count({ where }),
    prisma.classStudent.count({
      where: { ...where },
    }),
    prisma.schoolServer.count({
      where: { school_id },
    }),
    prisma.schoolServer.findUnique({
      where: { school_id_server_id: { school_id, server_id } },
      select: {
        dash: true,
        role: true,
        server: { select: { id: true, name: true, cpf: true } },
      },
    }),
    prisma.frequency.aggregate({
      _avg: { infrequency: true },
      where: { ...where, status: 'CLOSED' },
    }),
    prisma.frequency.count({
      where: { ...where, status: 'CLOSED' },
    }),
  ])

  if (school) schoolData = { ...schoolData, ...school }

  if (frequencyData._avg.infrequency)
    infrequency = frequencyData._avg.infrequency

  schoolData = {
    ...schoolData,
    classes,
    students,
    servers,
    frequencies,
    infrequency,
  }

  if (serverData) {
    const { dash, role, server } = serverData

    schoolData = {
      ...schoolData,
      server: { id: server.id, name: server.name, cpf: server.cpf, dash, role },
    }
  }

  return schoolData
}

export const schoolArrayReturn = async (
  schools: {
    id: string
  }[],
  year_id = '',
  server_id = '',
  class_id = '',
) => {
  const verify = schools.map((el) => {
    return schoolReturn(el.id, year_id, server_id, class_id)
  })

  return Promise.all(verify).then((school) => {
    return school
  })
}
