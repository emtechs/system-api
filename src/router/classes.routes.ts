import { Router } from 'express'
import {
  createClassController,
  createClassSchoolController,
  createClassStudentController,
  dashClassController,
  deleteClassStudentController,
  exportClassController,
  listClassController,
  listClassDashController,
  listClassYearController,
  retrieveClassController,
  retrieveClassYearController,
  transferClassStudentController,
} from '../controllers'
import {
  validateSchemaMiddleware,
  verifyIsAdmin,
  verifyIsPermission,
  verifyUserIsAuthenticated,
} from '../middlewares'
import {
  ClassCreateSchema,
  ClassSchoolCreateSchema,
  ClassStudentCreateSchema,
  TransferClassStudentSchema,
} from '../schemas'

export const classRouter = Router()

classRouter.post(
  '',
  verifyUserIsAuthenticated,
  validateSchemaMiddleware(ClassCreateSchema),
  createClassController,
)

classRouter.post(
  '/school',
  verifyUserIsAuthenticated,
  validateSchemaMiddleware(ClassSchoolCreateSchema),
  createClassSchoolController,
)

classRouter.post(
  '/student',
  verifyUserIsAuthenticated,
  validateSchemaMiddleware(ClassStudentCreateSchema),
  createClassStudentController,
)

classRouter.get('', verifyUserIsAuthenticated, listClassController)

classRouter.get('/year', verifyUserIsAuthenticated, listClassYearController)

classRouter.get(
  '/year/:key/view',
  verifyUserIsAuthenticated,
  retrieveClassYearController,
)

classRouter.get('/export', verifyUserIsAuthenticated, exportClassController)

classRouter.get(
  '/school/:school_id/dash/:year_id',
  verifyUserIsAuthenticated,
  verifyIsPermission,
  listClassDashController,
)

classRouter.get(
  '/:class_id',
  verifyUserIsAuthenticated,
  retrieveClassController,
)

classRouter.get(
  '/:class_id/:school_id/:year_id/dash',
  verifyUserIsAuthenticated,
  verifyIsPermission,
  dashClassController,
)

classRouter.patch(
  '/transfer',
  verifyUserIsAuthenticated,
  verifyIsAdmin,
  validateSchemaMiddleware(TransferClassStudentSchema),
  transferClassStudentController,
)

classRouter.delete(
  '/:key',
  verifyUserIsAuthenticated,
  verifyIsAdmin,
  deleteClassStudentController,
)
