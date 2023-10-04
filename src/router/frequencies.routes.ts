import { Router } from 'express'
import {
  createFrequencyController,
  createRequestController,
  deleteFrequencyController,
  deleteRequestController,
  listFrequencyController,
  listFrequencyErrorController,
  listFrequencyStudentController,
  listRequestController,
  resumeFrequencyController,
  resumeFrequencySchoolController,
  retrieveFrequencyController,
  updateFrequencyController,
  updateFrequencyStudentController,
} from '../controllers'
import {
  validateSchemaMiddleware,
  verifyIsAdmin,
  verifyIsPermission,
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
