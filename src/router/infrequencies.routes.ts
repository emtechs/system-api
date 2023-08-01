import { Router } from 'express'
import {
  reportClassController,
  reportSchoolController,
  reportStudentController,
} from '../controllers'
import {
  validateSchemaMiddleware,
  verifyUserIsAuthenticated,
} from '../middlewares'
import {
  ClassReportSchema,
  SchoolReportSchema,
  StudentReportSchema,
} from '../schemas'

export const infrequencyRouter = Router()

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

infrequencyRouter.post(
  '/report/school',
  verifyUserIsAuthenticated,
  validateSchemaMiddleware(SchoolReportSchema),
  reportSchoolController,
)
