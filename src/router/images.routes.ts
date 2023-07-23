import { Router } from 'express'
import { verifyUserIsAuthenticated } from '../middlewares'
import { upload } from '../lib'
import {
  createImageProfileController,
  deleteImageController,
} from '../controllers'

export const imageRouter = Router()

imageRouter.post(
  '/user',
  verifyUserIsAuthenticated,
  upload.single('image'),
  createImageProfileController,
)

imageRouter.delete('/:id', verifyUserIsAuthenticated, deleteImageController)
