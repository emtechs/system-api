import { IFrequencyStudentUpdateRequest } from '../../interfaces'
import { prisma } from '../../lib'

export const updateFrequencyStudentService = async (
  { justification, status, updated_at }: IFrequencyStudentUpdateRequest,
  id: string,
) => {
  let value = 0
  if (status === 'MISSED') value = 100
  const frequency = await prisma.frequencyStudent.update({
    where: { id },
    data: { justification, status, updated_at, value },
  })

  return frequency
}
