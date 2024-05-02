import { AppError } from '../../errors'
import { prisma } from '../../lib'

export const retrieveFrequencyStudentService = async (id: string) => {
  const frequency = await prisma.frequencyStudent.findUnique({
    where: { id },
    select: {
      id: true,
      status: true,
      updated_at: true,
      justification: true,
      student: { select: { registry: true, name: true } },
      frequency_id: true,
    },
  })

  if (!frequency) throw new AppError('frequency not found', 404)

  const { name, registry } = frequency.student

  const result = {
    ...frequency,
    name,
    registry,
  }

  return result
}
