import { Router } from 'express'
import {
  createFrequencyController,
  createRequestController,
  deleteFrequencyController,
  deleteRequestController,
  listFrequencyController,
  listFrequencyErrorController,
  listRequestController,
  resumeFrequencyController,
  resumeFrequencySchoolController,
  retrieveFrequencyController,
  updateFrequencyController,
} from '../controllers'
import {
  validateSchemaMiddleware,
  verifyIsAdmin,
  verifyIsPermission,
  verifyUserIsAuthenticated,
} from '../middlewares'
import {
  FrequencyCreateSchema,
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
  '/error',
  verifyUserIsAuthenticated,
  verifyIsAdmin,
  listFrequencyErrorController,
)

frequencyRouter.get(
  '/request',
  verifyUserIsAuthenticated,
  listRequestController,
)

frequencyRouter.get(
  '/resume/:year_id',
  verifyUserIsAuthenticated,
  resumeFrequencyController,
)

frequencyRouter.get(
  '/resume/:year_id/:school_id',
  verifyUserIsAuthenticated,
  verifyIsPermission,
  resumeFrequencySchoolController,
)

frequencyRouter.get(
  '/:id',
  verifyUserIsAuthenticated,
  retrieveFrequencyController,
)

frequencyRouter.patch(
  '/:id',
  verifyUserIsAuthenticated,
  validateSchemaMiddleware(FrequencyUpdateSchema),
  updateFrequencyController,
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
