import { v2 as cloudinary } from 'cloudinary';
import prisma from '../../prisma';
import fs from 'node:fs';
import { resolve } from 'node:path';
import { promisify } from 'node:util';
import { AppError } from '../../errors';
import 'dotenv/config';

export const deleteImageService = async (id: string) => {
  try {
    const { key } = await prisma.image.delete({
      where: { id },
    });
    if (!process.env.APP_URL) {
      await cloudinary.uploader.destroy(key);
    } else {
      promisify(fs.unlink)(
        resolve(__dirname, '..', '..', '..', 'tmp', 'uploads', key),
      );
    }
  } catch {
    throw new AppError('user not found', 404);
  }
};
