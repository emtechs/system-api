import { ZodTypeAny } from 'zod/lib'
import { NextFunction, Request, Response } from 'express'

export const validateSchemaMiddleware =
  (schema: ZodTypeAny) => (req: Request, res: Response, next: NextFunction) => {
    const bodyValidated = schema.parse(req.body)

    req.body = bodyValidated

    return next()
  }
