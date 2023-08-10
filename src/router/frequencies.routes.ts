import { Router } from 'express'
import {
  createFrequencyController,
  createRequestController,
  deleteFrequencyController,
  deleteRequestController,
  listFrequencyController,
  listFrequencyStudentController,
  listRequestController,
  retrieveFrequencyController,
  updateFrequencyController,
  updateFrequencyStudentController,
} from '../controllers'
import {
  validateSchemaMiddleware,
  verifyUserIsAuthenticated,
} from '../middlewares'
import {
  FrequencyCreateSchema,
  FrequencyStudentUpdateSchema,
  FrequencyUpdateSchema,
  RequestCreateSchema,
  RequestUpdateSchema,
} from '../schemas'

export const frequencyRouter = Router()

frequencyRouter.post(
  '',
  verifyUserIsAuthenticated,
  validateSchemaMiddleware(FrequencyCreateSchema),
  createFrequencyController,
)

frequencyRouter.post(
  '/request',
  verifyUserIsAuthenticated,
  validateSchemaMiddleware(RequestCreateSchema),
  createRequestController,
)

frequencyRouter.get('', verifyUserIsAuthenticated, listFrequencyController)

frequencyRouter.get(
  '/request',
  verifyUserIsAuthenticated,
  listRequestController,
)

frequencyRouter.get(
  '/:id',
  verifyUserIsAuthenticated,
  retrieveFrequencyController,
)

frequencyRouter.get(
  '/:id/student',
  verifyUserIsAuthenticated,
  listFrequencyStudentController,
)

frequencyRouter.patch(
  '/:id',
  verifyUserIsAuthenticated,
  validateSchemaMiddleware(FrequencyUpdateSchema),
  updateFrequencyController,
)

frequencyRouter.patch(
  '/student/:id',
  verifyUserIsAuthenticated,
  validateSchemaMiddleware(FrequencyStudentUpdateSchema),
  updateFrequencyStudentController,
)

frequencyRouter.delete(
  '/request',
  verifyUserIsAuthenticated,
  validateSchemaMiddleware(RequestUpdateSchema),
  deleteRequestController,
)

frequencyRouter.delete(
  '/:id',
  verifyUserIsAuthenticated,
  deleteFrequencyController,
)
