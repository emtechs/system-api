import { AppError } from '../../errors'
import { prisma } from '../../lib'

export const classYearReturn = async (
  class_id: string,
  school_id: string,
  year_id: string,
) => {
  let infrequency = 0

  const [
    classData,
    school,
    students,
    frequencies,
    classDataYear,
    frequencyData,
  ] = await Promise.all([
    prisma.class.findUnique({
      where: { id: class_id },
      select: { id: true, name: true },
    }),
    prisma.school.findUnique({
      where: { id: school_id },
      select: { id: true, name: true },
    }),
    prisma.student.count({
      where: {
        classes: { some: { class_id, school_id, year_id } },
      },
    }),
    prisma.frequency.count({
      where: { class_id, school_id, year_id, is_open: false },
    }),
    prisma.classYear.findUnique({
      where: { class_id_school_id_year_id: { class_id, school_id, year_id } },
      select: { key: true },
    }),
    prisma.frequency.aggregate({
      _avg: { infrequency: true },
      where: {
        is_open: false,
        class_id,
        school_id,
        year_id,
      },
    }),
  ])

  if (!classData || !classDataYear) throw new AppError('')

  if (frequencyData._avg.infrequency)
    infrequency = frequencyData._avg.infrequency

  return {
    ...classData,
    label: classData.name,
    school,
    students,
    frequencies,
    infrequency,
    year_id,
    key: classDataYear.key,
  }
}

export const classYearArrayReturn = async (
  classData: {
    class_id: string
    school_id: string
    year_id: string
  }[],
) => {
  const classes = classData.map((el) => {
    const { class_id, school_id, year_id } = el

    return classYearReturn(class_id, school_id, year_id)
  })

  return Promise.all(classes).then((school) => {
    return school
  })
}
