import { Router } from 'express';
import {
  createClassController,
  createSchoolController,
  createServerController,
  createStudentController,
  listClassController,
  listSchoolController,
  listStudentController,
  retrieveServerWithCpfController,
} from '../controllers';
import {
  validateSchemaMiddleware,
  verifyUserIsAuthenticated,
} from '../middlewares';
import {
  ClassCreateSchema,
  SchoolCreateSchema,
  ServerCreateSchema,
  StudentCreateSchema,
} from '../schemas';

export const schoolRouter = Router();

schoolRouter.post(
  '',
  verifyUserIsAuthenticated,
  validateSchemaMiddleware(SchoolCreateSchema),
  createSchoolController,
);

schoolRouter.get('', verifyUserIsAuthenticated, listSchoolController);

export const classRouter = Router();

classRouter.post(
  '/:id',
  verifyUserIsAuthenticated,
  validateSchemaMiddleware(ClassCreateSchema),
  createClassController,
);

classRouter.get('', verifyUserIsAuthenticated, listClassController);

export const studentRouter = Router();

studentRouter.post(
  '/:id',
  verifyUserIsAuthenticated,
  validateSchemaMiddleware(StudentCreateSchema),
  createStudentController,
);

studentRouter.get('', verifyUserIsAuthenticated, listStudentController);

export const serverRouter = Router();

serverRouter.post(
  '/:id',
  verifyUserIsAuthenticated,
  validateSchemaMiddleware(ServerCreateSchema),
  createServerController,
);

serverRouter.get(
  '/:id/cpf/:cpf',
  verifyUserIsAuthenticated,
  retrieveServerWithCpfController,
);
