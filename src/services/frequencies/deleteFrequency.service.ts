import { AppError } from '../../http/error'
import { prisma } from '../../lib'

export const deleteFrequencyService = async (id: string) => {
  try {
    await prisma.frequency.delete({
      where: { id },
    })
  } catch {
    throw new AppError('frequency not found', 404)
  }
}
