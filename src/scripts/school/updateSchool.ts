import { AppError } from '../../errors'
import { ISchoolUpdate } from '../../interfaces'
import { prisma } from '../../lib'

const verifySchoolDirector = async (
  { id }: ISchoolUpdate,
  director_id: string,
) => {
  if (!id) throw new AppError('')

  const school = await prisma.school.update({
    where: { id },
    data: {
      director_id,
      servers: {
        upsert: {
          where: {
            school_id_server_id: { school_id: id, server_id: director_id },
          },
          create: { server_id: director_id, dash: 'SCHOOL', role: 'DIRET' },
          update: { dash: 'SCHOOL', role: 'DIRET' },
        },
      },
    },
  })

  return school
}

export const updateSchoolDirector = async (
  schools: ISchoolUpdate[],
  director_id: string,
) => {
  const schoolsVerifyParse = schools.map((el) => {
    return verifySchoolDirector(el, director_id)
  })
  return Promise.all(schoolsVerifyParse).then((school) => {
    return school
  })
}

const verifySchoolServer = async ({ id }: ISchoolUpdate, server_id: string) => {
  if (!id) throw new AppError('')

  const school = await prisma.schoolServer.upsert({
    where: { school_id_server_id: { school_id: id, server_id } },
    create: { school_id: id, server_id },
    update: { dash: 'COMMON', role: 'SERV' },
  })

  return school
}

export const updateSchoolServer = async (
  schools: ISchoolUpdate[],
  server_id: string,
) => {
  const schoolsVerifyParse = schools.map((el) => {
    return verifySchoolServer(el, server_id)
  })
  return Promise.all(schoolsVerifyParse).then((school) => {
    return school
  })
}

const verifySchoolClass = async (
  { id }: ISchoolUpdate,
  school_id: string,
  year_id: string,
) => {
  if (!id) throw new AppError('')

  const classData = await prisma.class.update({
    where: { id },
    data: {
      schools: {
        connectOrCreate: {
          create: { school_id, year_id },
          where: {
            class_id_school_id_year_id: { class_id: id, school_id, year_id },
          },
        },
      },
    },
  })

  return classData
}

export const updateSchoolClass = async (
  classes: ISchoolUpdate[],
  school_id: string,
  year_id: string,
) => {
  const schoolsVerifyParse = classes.map((el) => {
    return verifySchoolClass(el, school_id, year_id)
  })
  return Promise.all(schoolsVerifyParse).then((school) => {
    return school
  })
}
