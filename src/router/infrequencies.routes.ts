import { Router } from 'express'
import {
  listClassYearInfrequencyController,
  listInfrequencyController,
  updateInfrequencyController,
} from '../controllers'
import {
  validateSchemaMiddleware,
  verifyUserIsAuthenticated,
} from '../middlewares'
import { FrequencyUpdateSchema } from '../schemas'

export const infrequencyRouter = Router()

infrequencyRouter.get('', verifyUserIsAuthenticated, listInfrequencyController)

infrequencyRouter.get(
  '/class',
  verifyUserIsAuthenticated,
  listClassYearInfrequencyController,
)

infrequencyRouter.patch(
  '/:id',
  verifyUserIsAuthenticated,
  validateSchemaMiddleware(FrequencyUpdateSchema),
  updateInfrequencyController,
)
