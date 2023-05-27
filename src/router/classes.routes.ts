import { Router } from 'express';
import {
  createClassController,
  createClassStudentController,
  exportClassController,
  listClassController,
  listClassWithSchoolController,
  updateClassSchoolController,
} from '../controllers';
import {
  validateSchemaMiddleware,
  verifyUserIsAuthenticated,
} from '../middlewares';
import {
  ClassCreateSchema,
  ClassSchoolUpdateSchema,
  ClassStudentCreateSchema,
} from '../schemas';

export const classRouter = Router();

classRouter.post(
  '',
  verifyUserIsAuthenticated,
  validateSchemaMiddleware(ClassCreateSchema),
  createClassController,
);

classRouter.post(
  '/:id',
  verifyUserIsAuthenticated,
  validateSchemaMiddleware(ClassStudentCreateSchema),
  createClassStudentController,
);

classRouter.get('', verifyUserIsAuthenticated, listClassController);

classRouter.get('/export', verifyUserIsAuthenticated, exportClassController);

classRouter.get(
  '/:id',
  verifyUserIsAuthenticated,
  listClassWithSchoolController,
);

classRouter.patch(
  '',
  verifyUserIsAuthenticated,
  validateSchemaMiddleware(ClassSchoolUpdateSchema),
  updateClassSchoolController,
);
