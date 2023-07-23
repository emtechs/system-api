import { Request, Response } from 'express'
import { createImageProfileService, deleteImageService } from '../services'

export const createImageProfileController = async (
  req: Request,
  res: Response,
) => {
  const image = await createImageProfileService(req.user.id, req.file)
  return res.status(201).json(image)
}

export const deleteImageController = async (req: Request, res: Response) => {
  await deleteImageService(req.params.id)
  return res.status(204).json({})
}
