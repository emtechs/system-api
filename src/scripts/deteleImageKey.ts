import { v2 as cloudinary } from 'cloudinary'
import fs from 'node:fs'
import { resolve } from 'node:path'
import { promisify } from 'node:util'
import { env } from '../env'

export const deleteImageKey = async (key: string) => {
  if (env.NODE_ENV === 'production') {
    await cloudinary.uploader.destroy(key)
  } else {
    promisify(fs.unlink)(
      resolve(__dirname, '..', '..', '..', 'tmp', 'uploads', key),
    )
  }
}
