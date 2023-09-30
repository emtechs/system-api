import sortArray from 'sort-array'
import { IQuery } from '../../interfaces'
import { prisma } from '../../lib'
import { frequencyMedSchool } from '../../scripts'

export const resumeFrequencySchoolService = async (
  year_id: string,
  school_id: string,
  { name }: IQuery,
) => {
  const [classes, total, med] = await Promise.all([
    prisma.classYear.findMany({
      where: {
        year_id,
        school_id,
        class: { name: { contains: name, mode: 'insensitive' } },
      },
      select: { class_id: true, school_id: true },
      orderBy: { class: { name: 'asc' } },
    }),
    prisma.classYear.count({
      where: {
        year_id,
        school_id,
        class: { name: { contains: name, mode: 'insensitive' } },
      },
    }),
    frequencyMedSchool(year_id),
  ])

  const result = await frequencyArrayResume(classes, year_id, med)

  return {
    total,
    result: sortArray(result, {
      by: 'prc',
      order: 'asc',
    }),
  }
}

const frequencyArrayResume = async (
  classes: {
    class_id: string
    school_id: string
  }[],
  year_id: string,
  med: number,
) => {
  const frequencyData = classes.map((el) =>
    frequencyResume(el.class_id, el.school_id, year_id, med),
  )

  return Promise.all(frequencyData).then((freq) => {
    return freq
  })
}

const frequencyResume = async (
  class_id: string,
  school_id: string,
  year_id: string,
  med: number,
) => {
  let prc = 0

  const [classData, schoolData, total] = await Promise.all([
    prisma.class.findUnique({
      where: { id: class_id },
      select: { id: true, name: true },
    }),
    prisma.school.findUnique({
      where: { id: school_id },
      select: { id: true, name: true },
    }),
    prisma.frequency.count({
      where: { school_id, year_id, class_id, is_open: false },
    }),
  ])

  if (total > med) {
    prc = 100
  } else {
    prc = (total / med) * 100
  }

  return { ...classData, school: schoolData, prc }
}
