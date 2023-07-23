import { IClass } from '../../interfaces'
import { prisma } from '../../lib'

const verifyClass = async ({ name }: IClass) => {
  const classData = await prisma.class.findUnique({ where: { name } })
  let elem = classData
  if (!classData) elem = await prisma.class.create({ data: { name } })

  return elem
}

export const importClass = async (classes: IClass[]) => {
  const classesVerifyParse = classes.map((el) => {
    return verifyClass(el)
  })
  return Promise.all(classesVerifyParse).then((elem) => {
    return elem
  })
}
