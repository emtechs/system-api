import { Router } from 'express'
import {
  validateSchemaMiddleware,
  verifyUserIsAuthenticated,
} from '../middlewares'
import {
  createSessionController,
  sendEmailToRecovery,
  updatePasswordController,
  verifyController,
} from '../controllers'
import {
  PasswordUpdateSchema,
  RecoveryPasswordSchema,
  SessionSchema,
} from '../schemas'

export const sessionRouter = Router()

sessionRouter.post(
  '',
  validateSchemaMiddleware(SessionSchema),
  createSessionController,
)

export const passwordRouter = Router()

passwordRouter.post(
  '',
  validateSchemaMiddleware(RecoveryPasswordSchema),
  sendEmailToRecovery,
)

passwordRouter.post(
  '/:userId/:token',
  validateSchemaMiddleware(PasswordUpdateSchema),
  updatePasswordController,
)

export const verifyRouter = Router()

verifyRouter.get('', verifyUserIsAuthenticated, verifyController)
