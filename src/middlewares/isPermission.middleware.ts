import { NextFunction, Request, Response } from 'express'
import { AppError } from '../errors'
import { prisma } from '../lib'

export const verifyIsPermission = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const server = await prisma.schoolServer.findUnique({
    where: {
      school_id_server_id: {
        school_id: req.params.school_id,
        server_id: req.user.id,
      },
    },
  })

  if (server) {
    return next()
  } else if (req.user.role === 'ADMIN') return next()

  throw new AppError('Missing permissions', 401)
}
