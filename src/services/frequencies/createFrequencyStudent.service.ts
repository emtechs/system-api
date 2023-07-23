import { prisma } from '../../lib'
import { IFrequencyStudentRequest } from '../../interfaces'

export const createFrequencyStudentService = async ({
  frequency_id,
  justification,
  status,
  student_id,
}: IFrequencyStudentRequest) => {
  const frequencie = await prisma.frequencyStudent.create({
    data: { frequency_id, justification, status, student_id },
  })

  return frequencie
}
