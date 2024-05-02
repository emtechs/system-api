import { prisma } from '../../lib'
import { IFrequencyStudentQuery } from '../../interfaces'
import {
  retrieveFrequencyService,
  retrieveFrequencyStudentService,
} from '../../services'

export const listFrequencyStudentService = async ({
  is_alter,
  isNot_presented,
  skip,
  take,
  name,
  frequency_id,
}: IFrequencyStudentQuery) => {
  if (take) take = +take
  if (skip) skip = +skip

  let where = {}
  let where_student = {}
  let frequency = {}

  if (name)
    where_student = {
      ...where_student,
      OR: [
        { name: { contains: name, mode: 'insensitive' } },
        { registry: { contains: name, mode: 'insensitive' } },
      ],
    }

  if (is_alter) where = { ...where, updated_at: { not: null } }

  if (isNot_presented) where = { ...where, status: { not: 'PRESENTED' } }

  if (frequency_id) {
    where = { ...where, frequency_id }
    frequency = await retrieveFrequencyService(frequency_id)
  }

  where = { ...where, student: { ...where_student } }

  const [frequencies, total] = await Promise.all([
    prisma.frequencyStudent.findMany({
      take,
      skip,
      where,
      select: {
        id: true,
      },
      orderBy: { student: { name: 'asc' } },
    }),
    prisma.frequencyStudent.count({
      where,
    }),
  ])

  const result = await frequencyStudentReturn(frequencies)

  return { total, result, frequency }
}

const frequencyStudentReturn = async (
  frequencyData: {
    id: string
  }[],
) => {
  const frequencies = frequencyData.map((el) =>
    retrieveFrequencyStudentService(el.id),
  )

  return Promise.all(frequencies).then((frequency) => {
    return frequency
  })
}
