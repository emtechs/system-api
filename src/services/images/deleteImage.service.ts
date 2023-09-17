import { v2 as cloudinary } from 'cloudinary'
import { prisma } from '../../lib'
import fs from 'node:fs'
import { resolve } from 'node:path'
import { promisify } from 'node:util'
import { AppError } from '../../errors'
import { env } from '../../env'

export const deleteImageService = async (id: string) => {
  try {
    const { key } = await prisma.image.delete({
      where: { id },
    })
    if (env.NODE_ENV === 'production') {
      await cloudinary.uploader.destroy(key)
    } else {
      promisify(fs.unlink)(
        resolve(__dirname, '..', '..', '..', 'tmp', 'uploads', key),
      )
    }
  } catch {
    throw new AppError('image not found', 404)
  }
}
