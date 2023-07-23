import { IClassQuery } from '../../interfaces'
import { prisma } from '../../lib'
import { ClassArraySchema } from '../../schemas'
import { classArrayReturn, classYearArrayReturn } from '../../scripts'

export const listClassService = async ({
  is_active,
  take,
  skip,
  order,
  by,
  school_id,
  year_id,
  name,
  is_school,
}: IClassQuery) => {
  if (take) take = +take
  if (skip) skip = +skip

  let where = {}
  let orderBy = {}

  if (order) {
    switch (order) {
      case 'name':
        orderBy = { name: by }
        break
    }
  }

  if (name) where = { ...where, name: { contains: name, mode: 'insensitive' } }

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

  where = { ...where, schools: { some: { year_id, school_id } } }

  if (is_school) {
    if (year_id && school_id)
      where = { ...where, schools: { none: { school_id, year_id } } }
  }

  const [classesData, total, classesLabel, yearsData] = await Promise.all([
    prisma.class.findMany({
      take,
      skip,
      where,
      orderBy,
    }),
    prisma.class.count({ where }),
    prisma.class.findMany({
      where,
      orderBy: { name: 'asc' },
    }),
    prisma.classYear.findMany({
      distinct: ['year_id'],
      select: { year: true },
    }),
  ])

  let returnResult = {}
  let result = {}

  const classes = ClassArraySchema.parse(classesLabel)

  const years = yearsData.map((el) => el.year)

  returnResult = { classes, total, years }

  if (!is_school && school_id && year_id) {
    const classYear = classesData.map((el) => {
      return { class_id: el.id, school_id, year_id }
    })
    result = await classYearArrayReturn(classYear)
  } else result = ClassArraySchema.parse(await classArrayReturn(classesData))

  return {
    ...returnResult,
    result,
  }
}
