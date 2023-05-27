import { Router } from 'express';
import {
  createStudentController,
  createStudentWithClassController,
  listStudentController,
  retrieveStudentController,
} from '../controllers';
import {
  validateSchemaMiddleware,
  verifyUserIsAuthenticated,
} from '../middlewares';
import { StudentCreateSchema, StudentCreateWithClassSchema } from '../schemas';

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

studentRouter.get('/:id', verifyUserIsAuthenticated, retrieveStudentController);
