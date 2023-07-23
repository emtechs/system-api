import { AppError } from '../../errors'
import { importSchool, loadSchool } from '../../scripts'

export const importSchoolService = async (file?: Express.Multer.File) => {
  if (!file) throw new AppError('')

  const schools = await loadSchool(file)

  return await importSchool(schools)
}
