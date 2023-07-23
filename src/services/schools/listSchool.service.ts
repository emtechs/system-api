import { ISchoolQuery } from '../../interfaces'
import { prisma } from '../../lib'
import { SchoolArraySchema } from '../../schemas'
import { schoolArrayReturn } from '../../scripts'

export const listSchoolService = async ({
  name,
  is_active,
  is_director,
  take,
  skip,
  server_id,
  year_id,
  infreq,
  none_server_id,
  school_id,
  class_id,
}: ISchoolQuery) => {
  if (take) take = +take
  if (skip) skip = +skip

  let where = {}

  if (name) where = { ...where, name: { contains: name, mode: 'insensitive' } }

  if (infreq)
    where = {
      ...where,
      infrequencies: { some: { value: { gte: +infreq } } },
    }

  if (is_active) {
    switch (is_active) {
      case 'true':
        where = { ...where, is_active: true }
        break

      case 'false':
        where = { ...where, is_active: false }
        break
    }
  }

  if (is_director) {
    switch (is_director) {
      case 'true':
        where = { ...where, director_id: { not: { equals: null } } }
        break

      case 'false':
        where = { ...where, director_id: { equals: null } }
        break
    }
  }

  if (none_server_id)
    where = { ...where, servers: { none: { server_id: none_server_id } } }

  if (server_id) where = { ...where, servers: { some: { server_id } } }

  if (school_id) where = { ...where, id: school_id }

  if (class_id) where = { ...where, classes: { some: { class_id } } }

  const [schools, total, schoolsLabel] = await Promise.all([
    prisma.school.findMany({
      take,
      skip,
      where,
      include: { director: { select: { id: true, name: true, cpf: true } } },
      orderBy: { name: 'asc' },
    }),
    prisma.school.count({ where }),
    prisma.school.findMany({
      where,
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }),
  ])

  if (year_id || server_id)
    return {
      schools: SchoolArraySchema.parse(schoolsLabel),
      total,
      result: SchoolArraySchema.parse(
        await schoolArrayReturn(schools, year_id, server_id),
      ),
    }

  return {
    schools: SchoolArraySchema.parse(schoolsLabel),
    total,
    result: SchoolArraySchema.parse(schools),
  }
}
