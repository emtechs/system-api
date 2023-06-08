import { Router } from 'express';
import {
  createClassController,
  createClassStudentController,
  exportClassController,
  listClassController,
  listClassSchoolController,
  retrieveClassSchoolController,
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

classRouter.get('/:id', verifyUserIsAuthenticated, listClassSchoolController);

classRouter.get(
  '/:class_id/:school_id/:year_id',
  verifyUserIsAuthenticated,
  retrieveClassSchoolController,
);

classRouter.patch(
  '',
  verifyUserIsAuthenticated,
  validateSchemaMiddleware(ClassSchoolUpdateSchema),
  updateClassSchoolController,
);
