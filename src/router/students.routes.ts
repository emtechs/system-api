import { Router } from 'express';
import {
  createStudentController,
  createStudentWithClassController,
  exportStudentController,
  listStudentController,
  retrieveStudentController,
  updateManyStudentController,
  updateStudentController,
} from '../controllers';
import {
  validateSchemaMiddleware,
  verifyUserIsAuthenticated,
} from '../middlewares';
import {
  StudentCreateSchema,
  StudentCreateWithClassSchema,
  StudentUpdateManySchema,
  StudentUpdateSchema,
} from '../schemas';

export const studentRouter = Router();

studentRouter.post(
  '',
  verifyUserIsAuthenticated,
  validateSchemaMiddleware(StudentCreateSchema),
  createStudentController,
);

studentRouter.post(
  '/:id',
  verifyUserIsAuthenticated,
  validateSchemaMiddleware(StudentCreateWithClassSchema),
  createStudentWithClassController,
);

studentRouter.get('', verifyUserIsAuthenticated, listStudentController);

studentRouter.get(
  '/export',
  verifyUserIsAuthenticated,
  exportStudentController,
);

studentRouter.get('/:id', verifyUserIsAuthenticated, retrieveStudentController);

studentRouter.patch(
  '',
  verifyUserIsAuthenticated,
  validateSchemaMiddleware(StudentUpdateManySchema),
  updateManyStudentController,
);

studentRouter.patch(
  '/:id',
  verifyUserIsAuthenticated,
  validateSchemaMiddleware(StudentUpdateSchema),
  updateStudentController,
);
