import { prisma } from '../../lib'
import { IClassRequest } from '../../interfaces'

export const createClassService = async ({ name }: IClassRequest) => {
  const classData = await prisma.class.create({
    data: { name },
  })

  return classData
}
