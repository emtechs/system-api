import { prisma } from '../../lib'
import { IRequestCreate } from '../../interfaces'

export const createRequestService = async (
  { justification, frequency_id, student_id }: IRequestCreate,
  user_id: string,
) => {
  const request = await prisma.request.create({
    data: { justification, user: { connect: { id: user_id } } },
  })

  const request_id = request.id

  if (frequency_id)
    await prisma.frequency.update({
      where: { id: frequency_id },
      data: { request_id },
    })

  if (student_id)
    await prisma.frequencyStudent.update({
      where: { id: student_id },
      data: { request_id },
    })

  return request
}
