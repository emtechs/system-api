import { AppError } from '../../errors';
import prisma from '../../prisma';
import 'dotenv/config';

export const createImageProfileService = async (
  { originalname: name, path, size, filename: key }: Express.Multer.File,
  user_id: string,
) => {
  let image = await prisma.image.findFirst({ where: { user_id } });
  if (image) throw new AppError('image profile already exists', 409);

  const data = {
    name,
    size,
    url: path,
    key,
    user_id,
  };

  if (!process.env.APP_URL) {
    image = await prisma.image.create({
      data,
    });
    return image;
  }

  const url = `${process.env.APP_URL}/files/${key}`;
  data.url = url;

  image = await prisma.image.create({
    data,
  });

  return image;
};
