import { AppError } from '../../errors'
import { importStudent, loadStudents } from '../../scripts'

export const importStudentService = async (
  class_id: string,
  school_id: string,
  year_id: string,
  file?: Express.Multer.File,
) => {
  if (!file) throw new AppError('')

  const students = await loadStudents(file, class_id, school_id, year_id)

  return await importStudent(students)
}
