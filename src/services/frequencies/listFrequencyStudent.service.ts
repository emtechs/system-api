import { prisma } from '../../lib'
import { IFrequencyStudentQuery } from '../../interfaces'
import { retrieveFrequencyService } from './retrieveFrequency.service'

export const listFrequencyStudentService = async (
  frequency_id: string,
  { is_alter, isNot_presented, skip, take, name }: IFrequencyStudentQuery,
) => {
  if (take) take = +take
  if (skip) skip = +skip

  let where = {}
  let where_student = {}

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

  where = { ...where, frequency_id, student: { ...where_student } }

  const [frequencies, total, frequency] = await Promise.all([
    prisma.frequencyStudent.findMany({
      take,
      skip,
      where,
      select: {
        id: true,
        status: true,
        updated_at: true,
        justification: true,
        student: { select: { registry: true, name: true } },
      },
      orderBy: { student: { name: 'asc' } },
    }),
    prisma.frequencyStudent.count({
      where,
    }),
    retrieveFrequencyService(frequency_id),
  ])

  const result = frequencies.map((el) => {
    const { name, registry } = el.student
    return {
      ...el,
      name,
      registry,
    }
  })

  return { total, result, frequency }
}
