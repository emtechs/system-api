import { Router } from 'express'
import {
  importClassController,
  importMonthController,
  importSchoolController,
  importStudentAllController,
  importStudentController,
  importUserController,
} from '../controllers'
import { verifyIsPermission, verifyUserIsAuthenticated } from '../middlewares'
import { uploadCsv } from '../lib'

export const importRouter = Router()

importRouter.post(
  '/user',
  verifyUserIsAuthenticated,
  uploadCsv.single('file'),
  importUserController,
)

importRouter.post(
  '/school',
  verifyUserIsAuthenticated,
  uploadCsv.single('file'),
  importSchoolController,
)

importRouter.post(
  '/class',
  verifyUserIsAuthenticated,
  uploadCsv.single('file'),
  importClassController,
)

importRouter.post(
  '/month',
  verifyUserIsAuthenticated,
  uploadCsv.single('file'),
  importMonthController,
)

importRouter.post(
  '/student',
  verifyUserIsAuthenticated,
  uploadCsv.single('file'),
  importStudentAllController,
)

importRouter.post(
  '/student/:class_id/:school_id',
  verifyUserIsAuthenticated,
  verifyIsPermission,
  uploadCsv.single('file'),
  importStudentController,
)
