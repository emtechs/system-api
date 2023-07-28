import { IStudentQuery } from '../../interfaces'
import { prisma } from '../../lib'

export const listClassStudentService = async ({
  take,
  skip,
  name,
  key_class,
  school_id,
  year_id,
  class_id,
}: IStudentQuery) => {
  if (take) take = +take
  if (skip) skip = +skip

  let whereName = {}

  if (name)
    whereName = {
      student: {
        OR: [
          { name: { contains: name, mode: 'insensitive' } },
          { registry: { contains: name, mode: 'insensitive' } },
        ],
      },
    }

  const [data, total] = await Promise.all([
    prisma.classStudent.findMany({
      take,
      skip,
      where: {
        class_year: { key: key_class },
        school_id,
        year_id,
        class_id,
        ...whereName,
      },
      select: {
        key: true,
        year_id: true,
        class_year: {
          select: {
            class: { select: { id: true, name: true } },
            school: { select: { id: true, name: true } },
          },
        },
        student: { select: { id: true, name: true, registry: true } },
      },
      orderBy: { student: { name: 'asc' } },
    }),
    prisma.classStudent.count({
      where: {
        class_year: { key: key_class },
        school_id,
        year_id,
        class_id,
        ...whereName,
      },
    }),
  ])

  const result = data.map((el) => {
    const { class_year, key, student, year_id: year_id_data } = el
    const { class: classData, school } = class_year
    const { id, name, registry } = student
    return {
      id,
      name,
      registry,
      class: classData,
      school,
      year_id: year_id_data,
      key,
      label: name,
    }
  })

  return { total, result }
}
