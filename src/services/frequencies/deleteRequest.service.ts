import { prisma } from '../../lib'
import { IRequestUpdate } from '../../interfaces'
import { AppError } from '../../errors'

export const deleteRequestService = async ({
  requests,
  status,
}: IRequestUpdate) => {
  try {
    await requestArray(requests, status)
  } catch {
    throw new AppError('request not found', 404)
  }
}

const verifyRequest = async (id: string, status: 'ACCEPTED' | 'REFUSED') => {
  if (status === 'REFUSED') {
    await prisma.request.delete({
      where: { id },
    })
  } else {
    const request = await prisma.request.delete({
      where: { id },
      select: {
        justification: true,
        frequency: { select: { id: true } },
        student: { select: { id: true } },
      },
    })

    if (request.frequency)
      await prisma.frequency.update({
        where: { id: request.frequency.id },
        data: { is_open: true, finished_at: 0 },
      })

    if (request.student)
      await prisma.frequencyStudent.update({
        where: { id: request.student.id },
        data: { status: 'JUSTIFIED', justification: request.justification },
      })
  }
}

const requestArray = async (
  requests: string[],
  status: 'ACCEPTED' | 'REFUSED',
) => {
  const requestData = requests.map((el) => verifyRequest(el, status))

  return Promise.all(requestData).then((data) => {
    return data
  })
}
