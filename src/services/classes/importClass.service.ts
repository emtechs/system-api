import { AppError } from '../../errors'
import { importClass, loadClasses } from '../../scripts'

export const importClassService = async (file?: Express.Multer.File) => {
  if (!file) throw new AppError('')

  const classes = await loadClasses(file)

  return await importClass(classes)
}
