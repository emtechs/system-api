import { AppError } from '../../http/error'
import { importMonth, loadMonth } from '../../scripts'

export const importMonthService = async (file?: Express.Multer.File) => {
  if (!file) throw new AppError('')

  const months = await loadMonth(file)

  return await importMonth(months)
}
