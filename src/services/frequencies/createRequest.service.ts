import { prisma } from '../../lib'
import { IRequestCreate } from '../../interfaces'

export const createRequestService = async (
  { description, name, year_id, frequency_id, student_id }: IRequestCreate,
  user_id: string,
) => {
  const request = await prisma.request.create({
    data: {
      description,
      month: { connect: { name } },
      year: { connect: { id: year_id } },
      orders: { create: { user_id } },
    },
  })

  if (frequency_id)
    await prisma.frequency.update({
      where: { id: frequency_id },
      data: { request: { connect: { id: request.id } } },
    })

  if (student_id)
    await prisma.frequencyStudent.update({
      where: { id: student_id },
      data: { request: { connect: { id: request.id } } },
    })

  return request
}
