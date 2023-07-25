import { AppError } from '../../errors'
import { IStudentKey } from '../../interfaces'
import { prisma } from '../../lib'

const verifyStudent = async ({ name, registry, key }: IStudentKey) => {
  let student = await prisma.student.findUnique({
    where: { registry },
  })

  if (!student)
    student = await prisma.student.create({
      data: {
        name,
        registry,
      },
    })

  const classSchool = await prisma.classYear.findUnique({
    where: {
      key,
    },
    select: { class_id: true, school_id: true, year_id: true },
  })

  if (!classSchool) throw new AppError('')

  const { class_id, school_id, year_id } = classSchool
  const student_id = student.id

  const classStudent = await prisma.classStudent.findFirst({
    where: {
      year_id,
      student_id,
    },
    select: { key: true },
  })

  if (classStudent)
    await prisma.classStudent.delete({ where: { key: classStudent.key } })

  const class_data = await prisma.classStudent.findUnique({
    where: {
      class_id_school_id_year_id_student_id: {
        class_id,
        school_id,
        year_id,
        student_id,
      },
    },
  })

  if (!class_data)
    await prisma.classStudent.create({
      data: { class_id, school_id, student_id, year_id },
    })

  return student
}

export const importStudentClass = async (students: IStudentKey[]) => {
  const studentsVerifyParse = students.map((el) => {
    return verifyStudent(el)
  })
  return Promise.all(studentsVerifyParse).then((student) => {
    return student
  })
}
