import { ISchool } from '../../interfaces'
import { prisma } from '../../lib'

const verifySchool = async ({ name, director_id }: ISchool) => {
  const schoolData = await prisma.school.findUnique({ where: { name } })
  let school = schoolData
  if (!schoolData) school = await prisma.school.create({ data: { name } })

  if (director_id)
    await prisma.school.update({
      where: { name },
      data: {
        director_id,
        servers: {
          create: { server_id: director_id, dash: 'SCHOOL', role: 'DIRET' },
        },
      },
    })

  return school
}

export const importSchool = async (schools: ISchool[]) => {
  const schoolsVerifyParse = schools.map((el) => {
    return verifySchool(el)
  })
  return Promise.all(schoolsVerifyParse).then((school) => {
    return school
  })
}
