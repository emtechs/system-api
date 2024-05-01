import { prisma } from '../../lib'
import { AppError } from '../../errors'
import { env } from '../../env'
import { deleteImageService } from './deleteImage.service'

export const createImageProfileService = async (
  user_id: string,
  file?: Express.Multer.File,
) => {
  if (!file) throw new AppError('')

  const { originalname: name, path, size, filename: key } = file

  const image = await prisma.image.findUnique({
    where: { user_id },
  })

  if (image) await deleteImageService(image.id)

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
