import { prisma } from '../../lib'
import { IQuery, IStudentRequest } from '../../interfaces'
import { AppError } from '../../errors'

export const createStudentService = async (
  {
    name,
    registry,
    class_id: class_id_data,
    school_id: school_id_data,
  }: IStudentRequest,
  { key_class, school_id, year_id }: IQuery,
) => {
  let student = await prisma.student.findUnique({ where: { registry } })

  if (student) throw new AppError('student already exists', 409)

  student = await prisma.student.create({
    data: {
      name,
      registry,
    },
  })

  if (key_class) {
    await prisma.classYear.update({
      where: { key: key_class },
      data: {
        students: { create: { student_id: student.id } },
      },
    })

    return student
  }

  if (year_id) {
    if (class_id_data && school_id) {
      await prisma.classYear.update({
        where: {
          class_id_school_id_year_id: {
            class_id: class_id_data,
            school_id,
            year_id,
          },
        },
        data: {
          students: { create: { student_id: student.id } },
        },
      })

      return student
    }

    if (class_id_data && school_id_data) {
      await prisma.classYear.update({
        where: {
          class_id_school_id_year_id: {
            class_id: class_id_data,
            school_id: school_id_data,
            year_id,
          },
        },
        data: {
          students: { create: { student_id: student.id } },
        },
      })

      return student
    }
  }

  return student
}
