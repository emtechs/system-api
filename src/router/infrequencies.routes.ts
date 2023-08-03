import { Router } from 'express'
import {
  infrequencySchoolController,
  reportClassController,
  reportSchoolController,
  reportStudentController,
} from '../controllers'
import {
  validateSchemaMiddleware,
  verifyIsPermission,
  verifyUserIsAuthenticated,
} from '../middlewares'
import {
  ClassReportSchema,
  SchoolReportSchema,
  StudentReportSchema,
} from '../schemas'

export const infrequencyRouter = Router()

infrequencyRouter.get(
  '/school/:school_id/:year_id',
  verifyUserIsAuthenticated,
  verifyIsPermission,
  infrequencySchoolController,
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

infrequencyRouter.post(
  '/report/school',
  verifyUserIsAuthenticated,
  validateSchemaMiddleware(SchoolReportSchema),
  reportSchoolController,
)
