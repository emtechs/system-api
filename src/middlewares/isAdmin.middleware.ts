import { NextFunction, Request, Response } from 'express'
import { AppError } from '../errors'

export const verifyIsAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.user.role === 'ADMIN') return next()

  throw new AppError('Missing permissions', 401)
}
