import { AppError } from '../../errors'
import { importUser, loadUser } from '../../scripts'

export const importUserService = async (file?: Express.Multer.File) => {
  if (!file) throw new AppError('')

  const users = await loadUser(file)

  return await importUser(users)
}
