import { Router } from 'express';
import { validateSchemaMiddleware } from '../middlewares';
import {
  createSessionController,
  sendEmailToRecovery,
  updatePasswordController,
} from '../controllers';
import {
  PasswordUpdateSchema,
  RecoveryPasswordSchema,
  SessionSchema,
} from '../schemas';

export const sessionRouter = Router();

sessionRouter.post(
  '',
  validateSchemaMiddleware(SessionSchema),
  createSessionController,
);

export const passwordRouter = Router();

passwordRouter.post(
  '',
  validateSchemaMiddleware(RecoveryPasswordSchema),
  sendEmailToRecovery,
);

passwordRouter.post(
  '/:userId/:token',
  validateSchemaMiddleware(PasswordUpdateSchema),
  updatePasswordController,
);
