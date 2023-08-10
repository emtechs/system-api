import { prisma } from '../../lib'
import { IRequestUpdate } from '../../interfaces'
import { AppError } from '../../errors'

export const deleteRequestService = async ({ requests }: IRequestUpdate) => {
  try {
    await requestArray(requests)
  } catch {
    throw new AppError('request not found', 404)
  }
}

const verifyRequest = async (id: string) => {
  await prisma.request.delete({ where: { id } })
}

const requestArray = async (
  requests: {
    id: string
  }[],
) => {
  const requestData = requests.map((el) => verifyRequest(el.id))

  return Promise.all(requestData).then((data) => {
    return data
  })
}
