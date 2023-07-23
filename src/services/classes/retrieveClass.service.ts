import { prisma } from '../../lib'
import { ClassReturnSchema } from '../../schemas'
import { classReturn } from '../../scripts'

export const retrieveClassService = async (id: string) => {
  const classData = await prisma.class.findUnique({
    where: { id },
  })

  return ClassReturnSchema.parse(await classReturn(classData))
}
