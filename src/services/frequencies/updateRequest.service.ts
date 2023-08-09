import { prisma } from '../../lib'
import { IRequestUpdate } from '../../interfaces'

export const updateRequestService = async (
  { is_open, is_read }: IRequestUpdate,
  id: string,
) => {
  const request = await prisma.request.update({
    where: { id },
    data: { is_open, is_read },
  })

  if (is_read) await prisma.request.delete({ where: { id } })

  return request
}
