import { AppError } from '../../errors'
import { IFrequencyStudentUpdateRequest } from '../../interfaces'
import { prisma } from '../../lib'
import { retrieveFrequencyStudentService } from './retrieveFrequencyStudent.service'

export const updateFrequencyStudentService = async (
  { justification, status, updated_at }: IFrequencyStudentUpdateRequest,
  id: string,
) => {
  let value = 0
  if (status === 'MISSED') value = 100

  try {
    await prisma.frequencyStudent.update({
      where: { id },
      data: { justification, status, updated_at, value },
    })

    return await retrieveFrequencyStudentService(id)
  } catch {
    throw new AppError('frequency not found', 404)
  }
}
