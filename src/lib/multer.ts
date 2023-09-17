import { Request } from 'express'
import multer, { FileFilterCallback } from 'multer'
import fs from 'node:fs'
import { resolve } from 'node:path'
import crypto from 'node:crypto'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { env } from '../env'

export const tmpfolder = resolve(__dirname, '..', '..', 'tmp', 'uploads')

if (env.NODE_ENV === 'dev') {
  if (!fs.existsSync(tmpfolder)) fs.mkdirSync(tmpfolder, { recursive: true })
}

export const fileSize = 2 * 1024 * 1024

export const storage =
  env.NODE_ENV === 'dev'
    ? multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, tmpfolder)
        },
        filename: (req, file, cb) => {
          crypto.randomBytes(16, (err, hash) => {
            if (err) cb(err, err.message)

            const filename = `${hash.toString('hex')}-${file.originalname}`

            cb(null, filename)
          })
        },
      })
    : new CloudinaryStorage({ cloudinary })

export const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  const allowedMimes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'text/csv',
  ]

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(null, false)
    cb(new Error('Invalid file type'))
  }
}

export const upload =
  env.NODE_ENV === 'dev'
    ? multer({
        dest: tmpfolder,
        storage,
        limits: { fileSize },
        fileFilter,
      })
    : multer({
        storage,
        limits: { fileSize },
        fileFilter,
      })

export const uploadCsv =
  env.NODE_ENV === 'dev'
    ? multer({
        dest: tmpfolder,
        storage,
        limits: { fileSize },
        fileFilter,
      })
    : multer({
        storage: multer.diskStorage({}),
        limits: { fileSize },
        fileFilter,
      })
