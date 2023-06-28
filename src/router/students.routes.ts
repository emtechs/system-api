import { Router } from 'express';
import {
  createStudentController,
  createStudentWithClassController,
  exportStudentController,
  listStudentController,
  retrieveStudentController,
  updateStudentController,
} from '../controllers';
import {
  validateSchemaMiddleware,
  verifyUserIsAuthenticated,
} from '../middlewares';
import {
  StudentCreateSchema,
  StudentCreateWithClassSchema,
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
  '/:id',
  verifyUserIsAuthenticated,
  validateSchemaMiddleware(StudentUpdateSchema),
  updateStudentController,
);
