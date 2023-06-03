import { Router } from 'express';
import {
  importClassController,
  importSchoolController,
  importStudentAllController,
  importStudentController,
  importUserController,
} from '../controllers';
import { verifyUserIsAuthenticated } from '../middlewares';
import { uploadCsv } from '../utils';

export const importRouter = Router();

importRouter.post(
  '/user',
  verifyUserIsAuthenticated,
  uploadCsv.single('file'),
  importUserController,
);

importRouter.post(
  '/school',
  verifyUserIsAuthenticated,
  uploadCsv.single('file'),
  importSchoolController,
);

importRouter.post(
  '/class',
  verifyUserIsAuthenticated,
  uploadCsv.single('file'),
  importClassController,
);

importRouter.post(
  '/student',
  verifyUserIsAuthenticated,
  uploadCsv.single('file'),
  importStudentAllController,
);

importRouter.post(
  '/student/:class_id/:school_id',
  verifyUserIsAuthenticated,
  uploadCsv.single('file'),
  importStudentController,
);
