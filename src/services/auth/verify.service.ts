import { AppError } from '../../errors'
import { IAuthQuery, IRequestUser } from '../../interfaces'
import { prisma } from '../../lib'
import {
  verifyClass,
  verifyClassYear,
  verifyFrequency,
  verifySchool,
  verifyStudent,
  verifyUser,
  verifyYear,
} from '../../scripts'

export const verifyService = async (
  { id, role }: IRequestUser,
  {
    class_id,
    school_id,
    user_id,
    frequency_id,
    student_id,
    year_id,
    year,
    key_class,
  }: IAuthQuery,
) => {
  if (user_id) {
    if (role !== 'ADMIN') throw new AppError('Missing permissions', 401)

    return await verifyUser(user_id)
  }

  if (key_class) return await verifyClassYear(key_class)

  if (school_id) {
    const server_id = id

    const server = await prisma.schoolServer.findUnique({
      where: {
        school_id_server_id: {
          school_id,
          server_id,
        },
      },
    })

    if (!server && role !== 'ADMIN')
      throw new AppError('Missing permissions', 401)

    return await verifySchool(school_id)
  }

  if (class_id) return await verifyClass(class_id)

  if (student_id) return await verifyStudent(student_id)

  if (frequency_id) return await verifyFrequency(frequency_id)

  if (year || year_id) return await verifyYear(year_id, year)
}
