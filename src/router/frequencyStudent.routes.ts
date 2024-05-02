import { Router } from 'express'
import {
  listFrequencyStudentController,
  retrieveFrequencyStudentController,
  updateFrequencyStudentController,
} from '../controllers'
import {
  validateSchemaMiddleware,
  verifyUserIsAuthenticated,
} from '../middlewares'
import { FrequencyStudentUpdateSchema } from '../schemas'

export const frequencyStudentRouter = Router()

frequencyStudentRouter.get(
  '',
  verifyUserIsAuthenticated,
  listFrequencyStudentController,
)

frequencyStudentRouter.get(
  '/:id',
  verifyUserIsAuthenticated,
  retrieveFrequencyStudentController,
)

frequencyStudentRouter.patch(
  '/:id',
  verifyUserIsAuthenticated,
  validateSchemaMiddleware(FrequencyStudentUpdateSchema),
  updateFrequencyStudentController,
)
