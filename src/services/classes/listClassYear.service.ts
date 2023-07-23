import { IClassQuery } from '../../interfaces'
import { prisma } from '../../lib'

export const listClassYearService = async (
  key: string,
  { view }: IClassQuery,
) => {
  if (view === 'student') {
    const [students, total, classData] = await Promise.all([
      prisma.classStudent.findMany({
        where: { is_active: true, class_year: { key } },
        select: {
          key: true,
          student: {
            select: { id: true, name: true, registry: true, created_at: true },
          },
        },
        orderBy: { student: { name: 'asc' } },
      }),
      prisma.classStudent.count({
        where: { is_active: true, class_year: { key } },
      }),
      prisma.classYear.findUnique({
        where: { key },
        include: {
          class: { select: { id: true, name: true } },
          school: { select: { id: true, name: true } },
        },
      }),
    ])

    const result = students.map((el) => {
      const { id, name, registry, created_at } = el.student
      return {
        id,
        name,
        registry,
        created_at,
        key: el.key,
        class: classData.class,
        school: classData.school,
        year_id: classData.year_id,
      }
    })

    return { total, result }
  }
}
