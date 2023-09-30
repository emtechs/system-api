import { prisma } from '../../lib'

export const frequencyMedSchool = async (year_id: string) => {
  const schools = await prisma.classYear.findMany({
    where: {
      year_id,
    },
    distinct: 'school_id',
    select: { school_id: true },
  })

  const total = await frequencyTotalSchoolArray(schools, year_id)

  const sum = total.reduce((ac, el) => ac + el, 0)

  const med = sum / total.length

  return med
}

export const frequencyTotalSchool = async (
  school_id: string,
  year_id: string,
) => {
  return await prisma.frequency.count({
    where: { school_id, year_id, is_open: false },
  })
}

export const frequencyTotalSchoolArray = async (
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
