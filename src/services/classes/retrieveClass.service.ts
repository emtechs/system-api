import { AppError } from '../../errors'
import { prisma } from '../../lib'
import { ClassReturnSchema } from '../../schemas'
import { classReturn } from '../../scripts'

export const retrieveClassService = async (id: string) => {
  const classData = await prisma.class.findUnique({
    where: { id },
  })

  if (!classData) throw new AppError('')

  return ClassReturnSchema.parse(await classReturn(classData))
}
