import sortArray from 'sort-array'
import { IQuery } from '../../interfaces'
import { prisma } from '../../lib'
import { frequencyTotalSchool } from '../../scripts'

export const resumeFrequencySchoolService = async (
  year_id: string,
  { name }: IQuery,
) => {
  const schools = await prisma.classYear.findMany({
    where: {
      year_id,
      school: { name: { contains: name, mode: 'insensitive' } },
    },
    distinct: 'school_id',
    select: { school_id: true },
  })

  const total = await frequencyTotalArrayResume(schools, year_id)

  const sum = total.reduce((ac, el) => ac + el, 0)

  const med = sum / total.length

  const result = await frequencyArrayResume(schools, year_id, med)

  return {
    total: total.length,
    result: sortArray(result, {
      by: 'prc',
      order: 'asc',
    }),
  }
}

const frequencyTotalArrayResume = async (
  schools: {
    school_id: string
  }[],
  year_id: string,
) => {
  const frequencyData = schools.map((el) =>
    frequencyTotalSchool(el.school_id, year_id),
  )

  return Promise.all(frequencyData).then((freq) => {
    return freq
  })
}

const frequencyArrayResume = async (
  schools: {
    school_id: string
  }[],
  year_id: string,
  med: number,
) => {
  const frequencyData = schools.map((el) =>
    frequencyResume(el.school_id, year_id, med),
  )

  return Promise.all(frequencyData).then((freq) => {
    return freq
  })
}

const frequencyResume = async (
  school_id: string,
  year_id: string,
  med: number,
) => {
  let prc = 0

  const [schoolData, total] = await Promise.all([
    prisma.school.findUnique({
      where: { id: school_id },
      select: { id: true, name: true },
    }),
    frequencyTotalSchool(school_id, year_id),
  ])

  if (total > med) {
    prc = 100
  } else {
    prc = (total / med) * 100
  }

  return { ...schoolData, prc }
}
