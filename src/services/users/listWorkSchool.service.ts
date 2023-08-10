import { IRequestUser, ISchoolQuery } from '../../interfaces'
import { prisma } from '../../lib'
import { SchoolArraySchema, SchoolServerArraySchema } from '../../schemas'
import { schoolArrayReturn, schoolServerArrayReturn } from '../../scripts'

export const listWorkSchoolService = async (
  { id: server_id, role }: IRequestUser,
  { take, skip, year_id, name, date }: ISchoolQuery,
) => {
  if (take) take = +take
  if (skip) skip = +skip

  let where = {}
  let where_school = {}

  where_school = { ...where_school, is_active: true }

  if (name)
    where_school = {
      ...where_school,
      name: { contains: name, mode: 'insensitive' },
    }

  if (year_id)
    where_school = { ...where_school, classes: { some: { year_id } } }

  if (role === 'ADMIN') {
    where = where_school

    const [schoolsData, total, schoolsLabel] = await Promise.all([
      prisma.school.findMany({
        take,
        skip,
        where,
        select: { id: true },
        orderBy: { name: 'asc' },
      }),
      prisma.school.count({
        where,
      }),
      prisma.school.findMany({
        select: { id: true, name: true },
        orderBy: { name: 'asc' },
      }),
    ])

    const schoolsSchema = SchoolArraySchema.parse(
      await schoolArrayReturn(schoolsData, year_id, undefined, undefined, date),
    )

    const schools = SchoolArraySchema.parse(schoolsLabel)

    const result = schoolsSchema.map((el) => {
      return { school: el }
    })

    return { schools, total, result }
  }

  where = { ...where, server_id, school: where_school }

  const [workSchools, total, schoolsData] = await Promise.all([
    prisma.schoolServer.findMany({
      take,
      skip,
      where,
      select: {
        role: true,
        dash: true,
        school: {
          select: { id: true },
        },
      },
      orderBy: { school: { name: 'asc' } },
    }),
    prisma.schoolServer.count({
      where,
    }),
    prisma.schoolServer.findMany({
      select: {
        school: {
          select: { id: true, name: true },
        },
      },
      orderBy: { school: { name: 'asc' } },
    }),
  ])

  const schoolSchema = SchoolServerArraySchema.parse(schoolsData)

  const schools = schoolSchema.map((el) => el.school)

  const result = SchoolServerArraySchema.parse(
    await schoolServerArrayReturn(workSchools, year_id, date),
  )

  return { schools, total, result }
}
