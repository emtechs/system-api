import { AppError } from '../../errors'
import { importStudent, loadStudentsAll } from '../../scripts'

export const importStudentAllService = async (file?: Express.Multer.File) => {
  if (!file) throw new AppError('')

  const students = await loadStudentsAll(file)

  return await importStudent(students)
}
