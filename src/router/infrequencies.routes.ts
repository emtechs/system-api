import { Router } from 'express'
import {
  listClassYearInfrequencyController,
  listInfrequencyController,
  reportClassController,
  updateInfrequencyController,
} from '../controllers'
import {
  validateSchemaMiddleware,
  verifyUserIsAuthenticated,
} from '../middlewares'
import { ClassReportSchema, FrequencyUpdateSchema } from '../schemas'

export const infrequencyRouter = Router()

infrequencyRouter.get('', verifyUserIsAuthenticated, listInfrequencyController)

infrequencyRouter.get(
  '/class',
  verifyUserIsAuthenticated,
  listClassYearInfrequencyController,
)

infrequencyRouter.post(
  '/report/class',
  verifyUserIsAuthenticated,
  validateSchemaMiddleware(ClassReportSchema),
  reportClassController,
)

infrequencyRouter.patch(
  '/:id',
  verifyUserIsAuthenticated,
  validateSchemaMiddleware(FrequencyUpdateSchema),
  updateInfrequencyController,
)
