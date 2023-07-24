import { AppError } from '../../errors'
import { importStudentClass, loadStudentsClass } from '../../scripts'

export const importStudentClassService = async (file?: Express.Multer.File) => {
  if (!file) throw new AppError('')

  const students = await loadStudentsClass(file)

  return await importStudentClass(students)
}
