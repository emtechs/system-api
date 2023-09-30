import { Router } from 'express'
import {
  createSchoolClassController,
  createSchoolController,
  createSchoolServerController,
  dashSchoolController,
  deleteDirectorSchoolController,
  deleteSchoolController,
  deleteSchoolServerController,
  exportSchoolController,
  listSchoolController,
  listSchoolServerController,
  retrieveSchoolController,
  updateSchoolController,
} from '../controllers'
import {
  validateSchemaMiddleware,
  verifyIsAdmin,
  verifyIsPermission,
  verifyUserIsAuthenticated,
} from '../middlewares'
import {
  SchoolClassCreateSchema,
  SchoolCreateSchema,
  SchoolServerCreateSchema,
  SchoolUpdateSchema,
} from '../schemas'

export const schoolRouter = Router()

schoolRouter.post(
  '',
  verifyUserIsAuthenticated,
  verifyIsAdmin,
  validateSchemaMiddleware(SchoolCreateSchema),
  createSchoolController,
)

schoolRouter.post(
  '/:server_id',
  verifyUserIsAuthenticated,
  verifyIsAdmin,
  validateSchemaMiddleware(SchoolServerCreateSchema),
  createSchoolServerController,
)

schoolRouter.post(
  '/:school_id/:year_id',
  verifyUserIsAuthenticated,
  verifyIsPermission,
  validateSchemaMiddleware(SchoolClassCreateSchema),
  createSchoolClassController,
)

schoolRouter.get(
  '',
  verifyUserIsAuthenticated,
  verifyIsAdmin,
  listSchoolController,
)

schoolRouter.get(
  '/server',
  verifyUserIsAuthenticated,
  listSchoolServerController,
)

schoolRouter.get('/export', verifyUserIsAuthenticated, exportSchoolController)

schoolRouter.get(
  '/:school_id',
  verifyUserIsAuthenticated,
  verifyIsPermission,
  retrieveSchoolController,
)

schoolRouter.get(
  '/:school_id/dash/:year_id',
  verifyUserIsAuthenticated,
  verifyIsPermission,
  dashSchoolController,
)

schoolRouter.patch(
  '/:school_id',
  verifyUserIsAuthenticated,
  verifyIsPermission,
  validateSchemaMiddleware(SchoolUpdateSchema),
  updateSchoolController,
)

schoolRouter.delete(
  '/:school_id',
  verifyUserIsAuthenticated,
  verifyIsPermission,
  deleteSchoolController,
)

schoolRouter.delete(
  '/:school_id/director',
  verifyUserIsAuthenticated,
  verifyIsPermission,
  deleteDirectorSchoolController,
)

schoolRouter.delete(
  '/:school_id/server/:server_id',
  verifyUserIsAuthenticated,
  verifyIsPermission,
  deleteSchoolServerController,
)
