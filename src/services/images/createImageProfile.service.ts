import { v2 as cloudinary } from 'cloudinary'
import { prisma } from '../../lib'
import fs from 'node:fs'
import { resolve } from 'node:path'
import { promisify } from 'node:util'
import { AppError } from '../../errors'
import { env } from '../../env'

export const createImageProfileService = async (
  user_id: string,
  file?: Express.Multer.File,
) => {
  if (!file) throw new AppError('')

  const { originalname: name, path, size, filename: key } = file

  const image = await prisma.image.findUnique({
    where: { user_id },
  })

  if (image) {
    const { id, key: keyData } = image

    await prisma.image.delete({
      where: { id },
    })

    if (env.NODE_ENV === 'production') {
      await cloudinary.uploader.destroy(keyData)
    } else {
      promisify(fs.unlink)(
        resolve(__dirname, '..', '..', '..', 'tmp', 'uploads', keyData),
      )
    }
  }

  const data = {
    name,
    size,
    url: path,
    key,
    user_id,
  }

  if (env.NODE_ENV === 'production')
    return await prisma.image.create({
      data,
    })

  const url = `http://localhost:${env.PORT}/files/${key}`
  data.url = url

  return await prisma.image.create({
    data,
  })
}
