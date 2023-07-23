import { IStudent } from '../../interfaces'
import { prisma } from '../../lib'

const verifyStudent = async ({
  name,
  registry,
  class_id,
  school_id,
  year_id,
}: IStudent) => {
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
      class_id_school_id_year_id: {
        class_id,
        school_id,
        year_id,
      },
    },
  })

  if (!classSchool)
    await prisma.classYear.create({
      data: { class_id, school_id, year_id },
    })

  const classStudent = await prisma.classStudent.findUnique({
    where: {
      class_id_school_id_year_id_student_id: {
        class_id,
        school_id,
        year_id,
        student_id: student.id,
      },
    },
  })

  if (!classStudent)
    await prisma.classStudent.create({
      data: { class_id, school_id, year_id, student_id: student.id },
    })

  return student
}

export const importStudent = async (students: IStudent[]) => {
  const studentsVerifyParse = students.map((el) => {
    return verifyStudent(el)
  })
  return Promise.all(studentsVerifyParse).then((student) => {
    return student
  })
}
