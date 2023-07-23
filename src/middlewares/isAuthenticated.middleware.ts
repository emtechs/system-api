/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express'
import { AppError } from '../errors'
import jwt from 'jsonwebtoken'
import { env } from '../env'
import { prisma } from '../lib'

export const verifyUserIsAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let authorization = req.headers.authorization

  if (!authorization) throw new AppError('Not authorized', 401)

  authorization = authorization.split(' ')[1]

  jwt.verify(authorization, env.SECRET_KEY, (error, decoded: any) => {
    if (error) throw new AppError(error.message, 400)

    req.user = {
      id: decoded.sub,
      role: decoded.role,
    }
  })

  const user = await prisma.user.findFirst({
    where: { AND: { id: req.user.id, is_active: true } },
  })

  if (!user) throw new AppError('Not authorized', 401)

  return next()
}
