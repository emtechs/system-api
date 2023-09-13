import { Router } from 'express'
import {
  createResumeStudentController,
  createStudentController,
  exportStudentController,
  listClassStudentController,
  listStudentController,
  resumeStudentController,
  retrieveStudentController,
  updateStudentController,
} from '../controllers'
import {
  validateSchemaMiddleware,
  verifyUserIsAuthenticated,
} from '../middlewares'
import { StudentCreateSchema, StudentUpdateSchema } from '../schemas'

export const studentRouter = Router()

studentRouter.post(
  '',
  verifyUserIsAuthenticated,
  validateSchemaMiddleware(StudentCreateSchema),
  createStudentController,
)

studentRouter.post(
  '/resume',
  verifyUserIsAuthenticated,
  createResumeStudentController,
)

studentRouter.get('', verifyUserIsAuthenticated, listStudentController)

studentRouter.get(
  '/class',
  verifyUserIsAuthenticated,
  listClassStudentController,
)

studentRouter.get('/resume', verifyUserIsAuthenticated, resumeStudentController)

studentRouter.get('/export', verifyUserIsAuthenticated, exportStudentController)

studentRouter.get('/:id', verifyUserIsAuthenticated, retrieveStudentController)

studentRouter.patch(
  '/:id',
  verifyUserIsAuthenticated,
  validateSchemaMiddleware(StudentUpdateSchema),
  updateStudentController,
)
