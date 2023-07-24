import { AppError } from '../../errors'
import { importClassStudent, loadClassStudent } from '../../scripts'

export const importClassStudentService = async (file?: Express.Multer.File) => {
  if (!file) throw new AppError('')

  const classes = await loadClassStudent(file)

  return await importClassStudent(classes)
}
