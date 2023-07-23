import { env } from '../../env'
import { AppError } from '../../errors'
import { prisma } from '../../lib'

export const createImageProfileService = async (
  user_id: string,
  file?: Express.Multer.File,
) => {
  if (!file) throw new AppError('')

  const { originalname: name, path, size, filename: key } = file

  let image = await prisma.image.findFirst({ where: { user_id } })
  if (image) throw new AppError('image profile already exists', 409)

  const data = {
    name,
    size,
    url: path,
    key,
    user_id,
  }

  if (env.NODE_ENV === 'production') {
    image = await prisma.image.create({
      data,
    })
    return image
  }

  const url = `http://localhost:${env.PORT}/files/${key}`
  data.url = url

  image = await prisma.image.create({
    data,
  })

  return image
}
