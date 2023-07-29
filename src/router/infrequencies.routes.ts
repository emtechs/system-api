import { Router } from 'express'
import {
  listClassYearInfrequencyController,
  listInfrequencyController,
  reportClassController,
  reportStudentController,
  updateInfrequencyController,
} from '../controllers'
import {
  validateSchemaMiddleware,
  verifyUserIsAuthenticated,
} from '../middlewares'
import {
  ClassReportSchema,
  FrequencyUpdateSchema,
  StudentReportSchema,
} from '../schemas'

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

infrequencyRouter.post(
  '/report/student',
  verifyUserIsAuthenticated,
  validateSchemaMiddleware(StudentReportSchema),
  reportStudentController,
)

infrequencyRouter.patch(
  '/:id',
  verifyUserIsAuthenticated,
  validateSchemaMiddleware(FrequencyUpdateSchema),
  updateInfrequencyController,
)
