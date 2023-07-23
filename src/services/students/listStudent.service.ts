import { IStudentQuery } from '../../interfaces'
import { prisma } from '../../lib'
import { studentArrayReturn } from '../../scripts'

export const listStudentService = async ({
  year_id,
  school_id,
  class_id,
  take,
  skip,
  by,
  order,
  name,
}: IStudentQuery) => {
  if (take) take = +take
  if (skip) skip = +skip

  let where = {}
  let where_classes = {}
  let orderBy = {}

  if (order) {
    switch (order) {
      case 'name':
        orderBy = { name: by }
        break

      case 'registry':
        orderBy = [{ registry: by }, { name: 'asc' }]
        break
    }
  }

  if (year_id) where_classes = { ...where_classes, some: { year_id } }

  if (school_id) where_classes = { ...where_classes, some: { school_id } }

  if (class_id) where_classes = { ...where_classes, some: { class_id } }

  if (year_id && school_id && class_id)
    where_classes = {
      every: {
        class_id,
        school_id,
        year_id,
        is_active: true,
      },
    }

  if (name) where = { ...where, name: { contains: name, mode: 'insensitive' } }

  where = {
    ...where,
    classes: { ...where_classes },
    NOT: { classes: { none: {} } },
  }

  const [students, total] = await Promise.all([
    prisma.student.findMany({
      take,
      skip,
      where,
      orderBy,
    }),
    prisma.student.count({ where }),
  ])

  return {
    total,
    result: await studentArrayReturn(students, year_id),
  }
}
