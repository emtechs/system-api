import { IClassStudent } from '../../interfaces'
import { prisma } from '../../lib'

const verifyClass = async ({
  class_id,
  school_id,
  student_id,
  year_id,
}: IClassStudent) => {
  const classData = await prisma.classStudent.findUnique({
    where: {
      class_id_school_id_year_id_student_id: {
        class_id,
        school_id,
        year_id,
        student_id,
      },
    },
  })
  let elem = classData
  if (!classData)
    elem = await prisma.classStudent.create({
      data: { class_id, school_id, year_id, student_id },
    })

  return elem
}

export const importClassStudent = async (classes: IClassStudent[]) => {
  const classesVerifyParse = classes.map((el) => {
    return verifyClass(el)
  })
  return Promise.all(classesVerifyParse).then((elem) => {
    return elem
  })
}
