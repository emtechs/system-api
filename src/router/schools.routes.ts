import { Router } from 'express';
import {
  createClassController,
  createFrequencyController,
  createFrequencyStudentController,
  createSchoolController,
  createServerController,
  createStudentController,
  listClassController,
  listFrequencyController,
  listFrequencyStudentController,
  listSchoolController,
  listStudentController,
  retrieveFrequencyController,
  retrieveServerWithCpfController,
  updateFrequencyController,
  updateFrequencyStudentController,
} from '../controllers';
import {
  validateSchemaMiddleware,
  verifyUserIsAuthenticated,
} from '../middlewares';
import {
  ClassCreateSchema,
  FrequencyCreateSchema,
  FrequencyStudentCreateSchema,
  FrequencyStudentUpdateSchema,
  FrequencyUpdateSchema,
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

export const frequencyRouter = Router();

frequencyRouter.post(
  '',
  verifyUserIsAuthenticated,
  validateSchemaMiddleware(FrequencyStudentCreateSchema),
  createFrequencyStudentController,
);

frequencyRouter.post(
  '/:id',
  verifyUserIsAuthenticated,
  validateSchemaMiddleware(FrequencyCreateSchema),
  createFrequencyController,
);

frequencyRouter.get('', verifyUserIsAuthenticated, listFrequencyController);

frequencyRouter.get(
  '/:id',
  verifyUserIsAuthenticated,
  retrieveFrequencyController,
);

frequencyRouter.patch(
  '/:id',
  verifyUserIsAuthenticated,
  validateSchemaMiddleware(FrequencyUpdateSchema),
  updateFrequencyController,
);

frequencyRouter.get(
  '/student',
  verifyUserIsAuthenticated,
  listFrequencyStudentController,
);

frequencyRouter.patch(
  '/student/:id',
  verifyUserIsAuthenticated,
  validateSchemaMiddleware(FrequencyStudentUpdateSchema),
  updateFrequencyStudentController,
);
